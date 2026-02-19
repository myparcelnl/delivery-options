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

const MOCK_DATE = '2025-01-15';

const setup = async (packageType?: SupportedPackageTypeName): Promise<ComputedRef<SelectOption<string>[]>> => {
  // For API-path package types, mock a controlled delivery options response
  if (packageType && DELIVERY_MOMENT_PACKAGE_TYPES.includes(packageType)) {
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

  mockDeliveryOptionsConfig(
    getMockDeliveryOptionsConfiguration({
      [KEY_CONFIG]: {
        [CarrierSetting.AllowDeliveryOptions]: true,
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
        // TODO: allow optional key to be passed with undefined as value
        ...(packageType ? {[CarrierSetting.PackageType]: packageType} : {}),
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
});
