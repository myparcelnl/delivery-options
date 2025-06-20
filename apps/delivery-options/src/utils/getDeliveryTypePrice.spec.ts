import {beforeEach, describe, expect, it} from 'vitest';
import {assign} from 'radash';
import {CARRIER_POST_NL, CARRIER_DHL_FOR_YOU, CARRIER_UPS} from '@myparcel-do/shared/testing';
import {
  type CarrierWithIdentifier,
  CustomDeliveryType,
  type SupportedDeliveryTypeName,
  CarrierSetting,
  PACKAGE_TYPE_DEFAULT,
  KEY_CONFIG,
  type SupportedPackageTypeName,
} from '@myparcel-do/shared';
import {CarrierName, DeliveryTypeName, PackageTypeName} from '@myparcel/constants';
import {useConfigStore} from '../stores';
import {
  createTestConfiguration,
  defineCarrier,
  mockDeliveryOptionsConfig,
  mockResolvedDeliveryOption,
  TestValue,
} from '../__tests__';
import {getDeliveryTypePrice} from './getDeliveryTypePrice';

interface TestInput {
  carrier: CarrierWithIdentifier;
  deliveryType: SupportedDeliveryTypeName;
  packageType?: SupportedPackageTypeName;
  result: number;
}

describe('getDeliveryTypePrice', () => {
  beforeEach(() => {
    useConfigStore().reset();
  });

  it.each([
    {
      carrier: defineCarrier(CARRIER_POST_NL),
      deliveryType: DeliveryTypeName.Standard,
      result: TestValue.CarrierPostNl,
    },
    {
      carrier: defineCarrier(CARRIER_DHL_FOR_YOU),
      deliveryType: DeliveryTypeName.Standard,
      result: TestValue.CarrierDhlForYou,
    },
    {
      carrier: defineCarrier(CARRIER_UPS),
      deliveryType: DeliveryTypeName.Standard,
      result: TestValue.CarrierUps | TestValue.Default,
    },
    {
      carrier: defineCarrier(CARRIER_UPS),
      deliveryType: DeliveryTypeName.Express,
      result: TestValue.CarrierUps | TestValue.DeliveryTypeExpress,
    },
    {
      carrier: defineCarrier(CARRIER_POST_NL),
      deliveryType: DeliveryTypeName.Pickup,
      result: TestValue.CarrierPostNl | TestValue.DeliveryTypePickup,
    },
    {
      carrier: defineCarrier({...CARRIER_DHL_FOR_YOU, identifier: `${CarrierName.DhlForYou}:1`}),
      deliveryType: DeliveryTypeName.Standard,
      result: TestValue.CarrierDhlForYou | TestValue.CustomContract1 | TestValue.Default,
    },
    {
      carrier: defineCarrier({...CARRIER_DHL_FOR_YOU, identifier: `${CarrierName.DhlForYou}:1`}),
      deliveryType: DeliveryTypeName.Pickup,
      result: TestValue.CarrierDhlForYou | TestValue.CustomContract1 | TestValue.DeliveryTypePickup,
    },
    {
      carrier: defineCarrier(CARRIER_POST_NL),
      deliveryType: DeliveryTypeName.Morning,
      result: TestValue.CarrierPostNl | TestValue.DeliveryTypeMorning,
    },
    {
      carrier: defineCarrier(CARRIER_POST_NL),
      deliveryType: CustomDeliveryType.Monday,
      result: TestValue.CarrierPostNl | TestValue.DeliveryTypeMonday,
    },
    {
      carrier: defineCarrier(CARRIER_DHL_FOR_YOU),
      deliveryType: CustomDeliveryType.SameDay,
      result: TestValue.CarrierDhlForYou | TestValue.DeliveryTypeSameDay,
    },
    {
      carrier: defineCarrier(CARRIER_POST_NL),
      deliveryType: DeliveryTypeName.Standard,
      packageType: PackageTypeName.Mailbox,
      result: TestValue.CarrierPostNl | TestValue.PackageTypeMailbox,
    },
    {
      carrier: defineCarrier(CARRIER_POST_NL),
      deliveryType: DeliveryTypeName.Standard,
      packageType: PackageTypeName.DigitalStamp,
      result: TestValue.CarrierPostNl | TestValue.PackageTypeDigitalStamp,
    },
    {
      carrier: defineCarrier(CARRIER_POST_NL),
      deliveryType: DeliveryTypeName.Standard,
      packageType: PackageTypeName.PackageSmall,
      result: TestValue.CarrierPostNl | TestValue.PackageTypePackageSmall,
    },
  ] satisfies TestInput[])(
    'resolves price for $carrier.identifier + $deliveryType + $packageType',
    ({carrier, deliveryType, packageType = PACKAGE_TYPE_DEFAULT, result = 0}) => {
      mockDeliveryOptionsConfig(
        // @ts-expect-error this is fine for test data
        assign(createTestConfiguration(), {[KEY_CONFIG]: {[CarrierSetting.PackageType]: packageType}}),
      );

      const option = mockResolvedDeliveryOption({deliveryType, carrier: carrier.identifier});

      expect(getDeliveryTypePrice(option.deliveryType, carrier.identifier)).toBe(result);
    },
  );
});
