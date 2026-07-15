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

  // Reproduces INT-1679. The "no date" (window=0) handling must be the same for the
  // per-carrier setting as for the global one. When a carrier has window=0 but the GLOBAL
  // window keeps its default (7), showDeliveryDate reads the global value and stays true,
  // so the dateless path is skipped; the per-carrier window=0 then produces no API dates
  // and the fallback filter drops the carrier (deliveryDaysWindow !== 0), leaving nothing.
  // Not reproducible in the sandbox because the sandbox sets the window globally.
  // @TODO: currently RED on purpose (proves INT-1679); should pass once the fix lands.
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
});
