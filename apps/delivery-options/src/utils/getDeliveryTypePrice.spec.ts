import {beforeEach, describe, expect, it} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {CARRIER_DHL_FOR_YOU, CARRIER_POST_NL, CARRIER_UPS} from '@myparcel-do/shared/testing';
import {type CarrierWithIdentifier, CustomDeliveryType, type SupportedDeliveryTypeName} from '@myparcel-do/shared';
import {CarrierName, DeliveryTypeName} from '@myparcel/constants';
import {defineCarrier, mockDeliveryOptionsConfig, mockResolvedDeliveryOption} from '../__tests__';
import {getDeliveryTypePrice} from './getDeliveryTypePrice';

type TestInput = {
  carrier: CarrierWithIdentifier;
  deliveryType: SupportedDeliveryTypeName;
  result: number;
};

describe('getDeliveryTypePrice', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it.each([
    {
      carrier: defineCarrier(CARRIER_POST_NL),
      deliveryType: DeliveryTypeName.Standard,
      result: 4.95,
    },
    {
      carrier: defineCarrier(CARRIER_DHL_FOR_YOU),
      deliveryType: DeliveryTypeName.Standard,
      result: 5.95,
    },
    {
      carrier: defineCarrier(CARRIER_UPS),
      deliveryType: DeliveryTypeName.Standard,
      result: 5.45,
    },
    {
      carrier: defineCarrier(CARRIER_POST_NL),
      deliveryType: DeliveryTypeName.Pickup,
      result: 1.45,
    },
    {
      carrier: defineCarrier({...CARRIER_DHL_FOR_YOU, identifier: `${CarrierName.DhlForYou}:12345`}),
      deliveryType: DeliveryTypeName.Standard,
      result: 5.45,
    },
    {
      carrier: defineCarrier({...CARRIER_DHL_FOR_YOU, identifier: `${CarrierName.DhlForYou}:12345`}),
      deliveryType: DeliveryTypeName.Pickup,
      result: -1,
    },
    {
      carrier: defineCarrier(CARRIER_POST_NL),
      deliveryType: DeliveryTypeName.Morning,
      result: 7.99,
    },
    {
      carrier: defineCarrier(CARRIER_POST_NL),
      deliveryType: CustomDeliveryType.Monday,
      result: 9.99,
    },
    {
      carrier: defineCarrier(CARRIER_DHL_FOR_YOU),
      deliveryType: CustomDeliveryType.SameDay,
      result: 11.95,
    },
  ] satisfies TestInput[])(
    'resolves price for $carrier.name $deliveryType to € $result',
    ({carrier, deliveryType, result}) => {
      mockDeliveryOptionsConfig({
        config: {
          priceMorningDelivery: 7.45,
          pricePickup: 1.45,
          priceStandardDelivery: 5.45,
          carrierSettings: {
            [CarrierName.DhlForYou]: {
              pricePickup: 0,
              priceStandardDelivery: 5.95,
              priceSameDayDelivery: 11.95,
            },
            [CarrierName.PostNl]: {
              priceStandardDelivery: 4.95,
              priceMorningDelivery: 7.99,
              priceMondayDelivery: 9.99,
            },
            [`${CarrierName.DhlForYou}:12345`]: {
              pricePickup: -1,
              priceStandardDelivery: 5.45,
            },
          },
        },
      });

      const option = mockResolvedDeliveryOption({deliveryType, carrier: carrier.identifier});

      expect(getDeliveryTypePrice(option.deliveryType, carrier.identifier)).toBe(result);
    },
  );
});
