import {toValue} from 'vue';
import {describe, it, expect, beforeEach} from 'vitest';
import {normalizeDate} from '@vueuse/core';
import {mockGetDeliveryOptions, getShipmentOptions} from '@myparcel-dev/do-shared/testing';
import {
  CarrierSetting,
  createTimestamp,
  DEFAULT_PLATFORM,
  KEY_CARRIER_SETTINGS,
  KEY_CONFIG,
  type SupportedPackageTypeName,
} from '@myparcel-dev/do-shared';
import {CarrierName, PackageTypeName, ShipmentOptionName} from '@myparcel-dev/constants';
import {getResolvedCarrier} from '../utils';
import {useConfigStore} from '../stores';
import {
  createDeliveryPossibility,
  getMockDeliveryOptionsConfiguration,
  mockDeliveryOptionsConfig,
  waitForDeliveryOptions,
} from '../__tests__';
import {useShipmentOptionsOptions} from './useShipmentOptionsOptions';
import {useSelectedValues} from './useSelectedValues';
import {useResolvedDeliveryOptions} from './useResolvedDeliveryOptions';

const setup = async (packageType: SupportedPackageTypeName, carrierIdentifier: CarrierName): Promise<void> => {
  const date = normalizeDate('2022-01-01T15:00:00');
  mockGetDeliveryOptions.mockReturnValue(
    Promise.resolve([
      {
        carrier: carrierIdentifier,
        date: createTimestamp(date),
        possibilities: [
          createDeliveryPossibility(date, {
            package_type: packageType,
            shipment_options: getShipmentOptions([ShipmentOptionName.Signature, ShipmentOptionName.OnlyRecipient]),
          }),
        ],
      },
    ]),
  );
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
          [carrierIdentifier]: {
            [CarrierSetting.PricePackageTypePackageSmall]: 6,
          },
        },
        ...(packageType ? {[CarrierSetting.PackageType]: packageType} : {}),
      },
    }),
  );
  useResolvedDeliveryOptions.clear();

  await waitForDeliveryOptions(carrierIdentifier);

  const moments = useResolvedDeliveryOptions();
  const momentsForCarrier = moments.value.filter(({carrier}) => carrier === carrierIdentifier);
  useSelectedValues().deliveryMoment.value = JSON.stringify(momentsForCarrier?.[0]);
};

describe('useShipmentOptionsOptions', () => {
  beforeEach(() => {
    useSelectedValues.clear();
    useResolvedDeliveryOptions.clear();
    useConfigStore().reset();
  });

  it.each([
    {packageType: PackageTypeName.Package, carrierIdentifier: CarrierName.PostNl},
    {packageType: PackageTypeName.PackageSmall, carrierIdentifier: CarrierName.PostNl},
    {packageType: PackageTypeName.DigitalStamp, carrierIdentifier: CarrierName.PostNl},
    {packageType: PackageTypeName.Mailbox, carrierIdentifier: CarrierName.PostNl},
    {packageType: PackageTypeName.Package, carrierIdentifier: CarrierName.DhlForYou},
    {packageType: PackageTypeName.PackageSmall, carrierIdentifier: CarrierName.DhlForYou},
    {packageType: PackageTypeName.DigitalStamp, carrierIdentifier: CarrierName.DhlForYou},
    {packageType: PackageTypeName.Mailbox, carrierIdentifier: CarrierName.DhlForYou},
  ])(
    'should show only the configured options for package type $packageType with carrier $carrierIdentifier',
    async ({packageType, carrierIdentifier}) => {
      await setup(packageType, carrierIdentifier);

      const result = useShipmentOptionsOptions();

      const configuration = getResolvedCarrier(carrierIdentifier, DEFAULT_PLATFORM).shipmentOptionsPerPackageType;
      const availableOptions = toValue(configuration)[packageType];
      expect(toValue(result).length).toBe(availableOptions?.size ?? 0);
      expect(toValue(result)).toMatchSnapshot();
    },
  );
});
