import {type ComputedRef} from 'vue';
import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {normalizeDate} from '@vueuse/core';
import {flushPromises} from '@vue/test-utils';
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

  it('returns one option per carrier without date when deliveryDaysWindow is 1', async () => {
    expect.assertions(3);

    const options = await setup(PackageTypeName.Package, {[CarrierSetting.DeliveryDaysWindow]: 1});

    // Two carriers are configured (postnl and postnl:123), both supporting delivery
    expect(options.value).toHaveLength(2);

    const resolved = options.value.map((option) => ({
      ...option,
      value: parseJson<SelectedDeliveryMoment>(option.value),
    }));

    // All options must have date: null (no date shown)
    expect(resolved.every((opt) => opt.value.date === null)).toBe(true);

    expect(resolved).toMatchSnapshot();
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
