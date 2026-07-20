import {type ComputedRef} from 'vue';
import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {normalizeDate} from '@vueuse/core';
import {flushPromises} from '@vue/test-utils';
import {waitFor} from '@testing-library/vue';
import {mockGetDeliveryOptions} from '@myparcel-dev/do-shared/testing';
import {
  type SupportedPackageTypeName,
  type SelectOption,
  KEY_CONFIG,
  CarrierSetting,
  KEY_CARRIER_SETTINGS,
  createTimestamp,
} from '@myparcel-dev/do-shared';
import {CarrierName, PackageTypeName, ShipmentOptionName} from '@myparcel-dev/constants';
import {parseJson} from '../utils';
import {type SelectedDeliveryMoment} from '../types';
import {useConfigStore} from '../stores';
import {DELIVERY_MOMENT_PACKAGE_TYPES} from '../data';
import {
  mockSelectedDeliveryOptions,
  mockDeliveryOptionsConfig,
  getMockDeliveryOptionsConfiguration,
  waitForDeliveryOptions,
  createDeliveryPossibility,
} from '../__tests__';
import {useSelectedValues} from './useSelectedValues';
import {useResolvedDeliveryOptions} from './useResolvedDeliveryOptions';
import {useDeliveryMomentOptions} from './useDeliveryMomentOptions';

const {mockStringToDateResult} = vi.hoisted(() => ({mockStringToDateResult: {value: undefined as Date | undefined}}));

vi.mock('../utils', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('../utils')>();

  return {
    ...actual,
    stringToDate: (date: string) => mockStringToDateResult.value ?? actual.stringToDate(date),
  };
});

const MOCK_DATE = '2025-01-15';

const createFallbackMock = (dateString: string) => () => {
  mockGetDeliveryOptions.mockImplementation((endpoint, opts) => {
    void endpoint;

    if (opts.parameters?.carrier === CarrierName.PostNl) {
      return Promise.resolve([
        {
          date: createTimestamp(`${dateString} 12:00:00`),
          possibilities: [
            createDeliveryPossibility(normalizeDate(`${dateString}T15:00:00`), {
              package_type: PackageTypeName.Package,
              shipment_options: [
                {name: ShipmentOptionName.Signature, schema: {type: 'boolean', enum: [true, false]}},
                {name: ShipmentOptionName.OnlyRecipient, schema: {type: 'boolean', enum: [true, false]}},
              ],
            }),
          ],
        },
      ]);
    }

    return Promise.resolve([]);
  });
};

const FALLBACK_EXTRA_CONFIG = {
  [KEY_CARRIER_SETTINGS]: {
    [CarrierName.PostNl]: {
      [CarrierSetting.AllowStandardDelivery]: true,
    },
    [CarrierName.DhlForYou]: {
      [CarrierSetting.AllowStandardDelivery]: true,
    },
  },
};

const setup = async (
  packageType?: SupportedPackageTypeName,
  extraConfig?: Record<string, unknown>,
  mockDeliveryResponse?: () => void,
): Promise<ComputedRef<SelectOption<string>[]>> => {
  // For API-path package types, mock a controlled delivery options response
  if (packageType && DELIVERY_MOMENT_PACKAGE_TYPES.includes(packageType)) {
    if (mockDeliveryResponse) {
      mockDeliveryResponse();
    } else {
      mockGetDeliveryOptions.mockImplementation(() =>
        Promise.resolve([
          {
            date: createTimestamp(`${MOCK_DATE} 00:00:00`),
            possibilities: [
              createDeliveryPossibility(normalizeDate(`${MOCK_DATE}T15:00:00`), {
                package_type: packageType,
                shipment_options: [
                  {name: ShipmentOptionName.Signature, schema: {type: 'boolean', enum: [true, false]}},
                  {name: ShipmentOptionName.OnlyRecipient, schema: {type: 'boolean', enum: [true, false]}},
                ],
              }),
            ],
          },
        ]),
      );
    }
  }

  mockDeliveryOptionsConfig(
    getMockDeliveryOptionsConfiguration({
      [KEY_CONFIG]: {
        [CarrierSetting.AllowStandardDelivery]: true,
        [CarrierSetting.AllowEveningDelivery]: true,
        [CarrierSetting.AllowMorningDelivery]: true,
        [CarrierSetting.AllowSignature]: true,
        [CarrierSetting.AllowOnlyRecipient]: true,
        [CarrierSetting.PriceStandardDelivery]: 3,
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
            [CarrierSetting.PricePackageTypePackageSmall]: 6,
          },
          [`${CarrierName.PostNl}:123`]: {
            [CarrierSetting.PriceStandardDelivery]: 456,
            [CarrierSetting.PricePackageTypeMailbox]: 5,
            [CarrierSetting.PricePackageTypeDigitalStamp]: 4,
          },
        },
        ...(packageType ? {[CarrierSetting.PackageType]: packageType} : {}),
        ...(extraConfig ?? {}),
      },
    }),
  );
  mockSelectedDeliveryOptions();

  const options = useDeliveryMomentOptions();
  await waitForDeliveryOptions();
  await flushPromises();

  // Simulate what DateSelector.vue does: auto-select the first delivery date
  const resolvedOptions = useResolvedDeliveryOptions();

  if (resolvedOptions.value.length > 0 && resolvedOptions.value[0].date) {
    const {deliveryDate} = useSelectedValues();
    deliveryDate.value = resolvedOptions.value[0].date;
    await flushPromises();
  }

  return options;
};

describe('useDeliveryMomentOptions', () => {
  beforeEach(() => {
    useConfigStore().reset();
  });

  afterEach(() => {
    mockStringToDateResult.value = undefined;
    vi.restoreAllMocks();
  });

  it.each([
    PackageTypeName.Package,
    PackageTypeName.Mailbox,
    PackageTypeName.DigitalStamp,
    PackageTypeName.PackageSmall,
  ])('returns delivery moment options with package type %s', async (packageType) => {
    expect.assertions(2);

    const options = await setup(packageType);

    expect(options.value).toHaveLength(2);

    const resolved = options.value.map((option) => ({
      ...option,
      value: parseJson<SelectedDeliveryMoment>(option.value),
    }));

    expect(resolved).toMatchSnapshot();
  });

  it('shows every carrier as a dateless option when the global deliveryDaysWindow is 0 and no carrier-specific window is set', async () => {
    mockDeliveryOptionsConfig(
      getMockDeliveryOptionsConfiguration({
        [KEY_CONFIG]: {
          [CarrierSetting.PackageType]: PackageTypeName.Package,
          [CarrierSetting.DeliveryDaysWindow]: 0,
          [KEY_CARRIER_SETTINGS]: {
            [CarrierName.PostNl]: {[CarrierSetting.AllowStandardDelivery]: true},
            [CarrierName.DhlForYou]: {[CarrierSetting.AllowStandardDelivery]: true},
          },
        },
      }),
    );
    mockSelectedDeliveryOptions();

    const options = useDeliveryMomentOptions();
    const resolved = useResolvedDeliveryOptions();

    // window=0 makes no API request, so settle the async computed manually.
    void resolved.load();
    await waitFor(() => !resolved.loading.value, {timeout: 3000});
    await flushPromises();

    const parsed = options.value.map((option) => parseJson<SelectedDeliveryMoment>(option.value));

    // window=0 means "no date": each carrier shows a single dateless (fake) option.
    expect(parsed).toHaveLength(2);
    expect(parsed.every((opt) => opt.date === null && opt.time === null)).toBe(true);
  });

  // Regression test for INT-1679: "no date" (deliveryDaysWindow=0) must behave the same per carrier as globally.
  // A carrier with deliveryDaysWindow=0 should still render as a single dateless option,
  // even when the global deliveryDaysWindow is > 0.
  // Reproducible in the sandbox by setting a per-carrier deliveryDaysWindow override.
  // This test should stay green to prevent regressions.
  it('shows a per-carrier deliveryDaysWindow=0 carrier as a dateless option, just like the global setting', async () => {
    mockDeliveryOptionsConfig(
      getMockDeliveryOptionsConfiguration({
        [KEY_CONFIG]: {
          [CarrierSetting.PackageType]: PackageTypeName.Package,
          [CarrierSetting.DeliveryDaysWindow]: 3,
          [KEY_CARRIER_SETTINGS]: {
            [CarrierName.PostNl]: {
              [CarrierSetting.AllowStandardDelivery]: true,
              [CarrierSetting.DeliveryDaysWindow]: 0,
            },
          },
        },
      }),
    );
    mockSelectedDeliveryOptions();

    const options = useDeliveryMomentOptions();
    const resolved = useResolvedDeliveryOptions();

    // No delivery-options API request is made when the window is 0, so settle the
    // async computed manually instead of waiting for a request that never fires.
    void resolved.load();
    await waitFor(() => !resolved.loading.value, {timeout: 3000});
    await flushPromises();

    const parsed = options.value.map((option) => parseJson<SelectedDeliveryMoment>(option.value));

    // Same "no date" shape as the global window=0 case: the carrier shows up, without date or time.
    expect(parsed).toHaveLength(1);
    expect(parsed[0].carrier).toBe(CarrierName.PostNl);
    expect(parsed[0].date).toBeNull();
    expect(parsed[0].time).toBeNull();
  });

  it('shows a per-carrier window=0 carrier as dateless next to a carrier that has dates', async () => {
    // Mixed windows: PostNl has window=0 (dateless "fake" option), DhlForYou inherits the
    // global window and returns real dates. Both must show.
    mockGetDeliveryOptions.mockImplementation((endpoint, opts) => {
      void endpoint;

      if (opts.parameters?.carrier === CarrierName.DhlForYou) {
        return Promise.resolve([
          {
            date: createTimestamp(`${MOCK_DATE} 00:00:00`),
            possibilities: [
              createDeliveryPossibility(normalizeDate(`${MOCK_DATE}T15:00:00`), {
                package_type: PackageTypeName.Package,
                shipment_options: [],
              }),
            ],
          },
        ]);
      }

      return Promise.resolve([]);
    });

    mockDeliveryOptionsConfig(
      getMockDeliveryOptionsConfiguration({
        [KEY_CONFIG]: {
          [CarrierSetting.PackageType]: PackageTypeName.Package,
          [KEY_CARRIER_SETTINGS]: {
            [CarrierName.PostNl]: {
              [CarrierSetting.AllowStandardDelivery]: true,
              [CarrierSetting.DeliveryDaysWindow]: 0,
            },
            [CarrierName.DhlForYou]: {[CarrierSetting.AllowStandardDelivery]: true},
          },
        },
      }),
    );
    mockSelectedDeliveryOptions();

    const options = useDeliveryMomentOptions();
    await waitForDeliveryOptions(CarrierName.DhlForYou);
    await flushPromises();

    // Select the DhlForYou date so its moment shows up, like DateSelector.vue does.
    const resolvedOptions = useResolvedDeliveryOptions();

    if (resolvedOptions.value.length > 0 && resolvedOptions.value[0].date) {
      const {deliveryDate} = useSelectedValues();
      deliveryDate.value = resolvedOptions.value[0].date;
      await flushPromises();
    }

    const parsed = options.value.map((option) => parseJson<SelectedDeliveryMoment>(option.value));
    const postnl = parsed.find((opt) => opt.carrier === CarrierName.PostNl);
    const dhl = parsed.find((opt) => opt.carrier === CarrierName.DhlForYou);

    // PostNl (window=0) is a dateless fake option; DhlForYou (inherits global) has a real date.
    expect(postnl?.date).toBeNull();
    expect(postnl?.time).toBeNull();
    expect(dhl?.date).not.toBeNull();
  });

  it('does not show fallback carriers when selected date is today', async () => {
    mockStringToDateResult.value = new Date();

    const options = await setup(PackageTypeName.Package, FALLBACK_EXTRA_CONFIG, createFallbackMock(MOCK_DATE));

    const carriers = options.value.map((option) => parseJson<SelectedDeliveryMoment>(option.value).carrier);

    expect(carriers).toContain(CarrierName.PostNl);
    expect(carriers).not.toContain(CarrierName.DhlForYou);
  });

  it('shows fallback carriers when selected date is in the future', async () => {
    const options = await setup(PackageTypeName.Package, FALLBACK_EXTRA_CONFIG, createFallbackMock(MOCK_DATE));

    const resolved = options.value.map((option) => parseJson<SelectedDeliveryMoment>(option.value));
    const carriers = resolved.map((opt) => opt.carrier);

    expect(carriers).toContain(CarrierName.PostNl);
    expect(carriers).toContain(CarrierName.DhlForYou);

    const fallbackOption = resolved.find((opt) => opt.carrier === CarrierName.DhlForYou);

    expect(fallbackOption?.date).toBeNull();
    expect(fallbackOption?.time).toBeNull();
  });

  it('renders a same-day option in dateless mode for same-day capable carriers before the cutoff', async () => {
    const options = await setup(PackageTypeName.Package, {
      [CarrierSetting.DeliveryDaysWindow]: 1,
      [KEY_CARRIER_SETTINGS]: {
        [CarrierName.PostNl]: {
          [CarrierSetting.AllowStandardDelivery]: true,
        },
        [CarrierName.Trunkrs]: {
          [CarrierSetting.AllowSameDayDelivery]: true,
          [CarrierSetting.CutoffTimeSameDay]: '23:59',
        },
      },
    });

    const resolved = options.value.map((option) => parseJson<SelectedDeliveryMoment>(option.value));

    expect(resolved.some((opt) => opt.carrier === CarrierName.Trunkrs && opt.deliveryType === 'same_day')).toBe(true);
    expect(resolved.some((opt) => opt.carrier === CarrierName.PostNl && opt.deliveryType === 'standard')).toBe(true);
  });

  it('does not render a same-day option in dateless mode past the cutoff', async () => {
    const options = await setup(PackageTypeName.Package, {
      [CarrierSetting.DeliveryDaysWindow]: 1,
      [KEY_CARRIER_SETTINGS]: {
        [CarrierName.PostNl]: {
          [CarrierSetting.AllowStandardDelivery]: true,
        },
        [CarrierName.Trunkrs]: {
          [CarrierSetting.AllowSameDayDelivery]: true,
          [CarrierSetting.CutoffTimeSameDay]: '00:00',
        },
      },
    });

    const carriers = options.value.map((option) => parseJson<SelectedDeliveryMoment>(option.value).carrier);

    expect(carriers).not.toContain(CarrierName.Trunkrs);
  });

  it('does not show a standard fallback for carriers that do not support standard delivery', async () => {
    const options = await setup(
      PackageTypeName.Package,
      {
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
            [CarrierSetting.AllowStandardDelivery]: true,
          },
          [CarrierName.UpsExpressSaver]: {
            [CarrierSetting.AllowExpressDelivery]: true,
          },
        },
      },
      createFallbackMock(MOCK_DATE),
    );

    const carriers = options.value.map((option) => parseJson<SelectedDeliveryMoment>(option.value).carrier);

    expect(carriers).toContain(CarrierName.PostNl);
    expect(carriers).not.toContain(CarrierName.UpsExpressSaver);
  });

  it('shows a synthesized same-day option for a same-day-only carrier when today is selected', async () => {
    const options = await setup(
      PackageTypeName.Package,
      {
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
            [CarrierSetting.AllowStandardDelivery]: true,
          },
          [CarrierName.Trunkrs]: {
            [CarrierSetting.AllowSameDayDelivery]: true,
            [CarrierSetting.CutoffTimeSameDay]: '23:59',
          },
        },
      },
      createFallbackMock(MOCK_DATE),
    );

    const resolvedOptions = useResolvedDeliveryOptions();
    const sameDayMoment = resolvedOptions.value.find((opt) => opt.carrier === CarrierName.Trunkrs);

    expect(sameDayMoment?.date).toBeTruthy();

    const {deliveryDate} = useSelectedValues();
    deliveryDate.value = sameDayMoment?.date ?? '';
    await flushPromises();

    const resolved = options.value.map((option) => parseJson<SelectedDeliveryMoment>(option.value));

    expect(resolved.some((opt) => opt.carrier === CarrierName.Trunkrs && opt.deliveryType === 'same_day')).toBe(true);
    // PostNL has no moments for today and gets no standard fallback either (selected date is today).
    expect(resolved.some((opt) => opt.carrier === CarrierName.PostNl)).toBe(false);
  });
});
