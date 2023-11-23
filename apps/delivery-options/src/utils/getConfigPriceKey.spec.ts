import {describe, expect, it} from 'vitest';
import {
  PRICE_EVENING_DELIVERY,
  PRICE_MORNING_DELIVERY,
  PRICE_ONLY_RECIPIENT,
  PRICE_PICKUP,
  PRICE_SIGNATURE,
  PRICE_STANDARD_DELIVERY,
} from '@myparcel-do/shared';
import {DeliveryTypeName, ShipmentOptionName} from '@myparcel/constants';
import {getConfigPriceKey} from './getConfigPriceKey';

describe('getConfigPriceKey', () => {
  it.each([
    [DeliveryTypeName.Standard, PRICE_STANDARD_DELIVERY],
    [DeliveryTypeName.Evening, PRICE_EVENING_DELIVERY],
    [DeliveryTypeName.Morning, PRICE_MORNING_DELIVERY],
    [DeliveryTypeName.Pickup, PRICE_PICKUP],
  ] as const)('returns price key for delivery type %s', (deliveryType, priceKey) => {
    expect(getConfigPriceKey(deliveryType)).toBe(priceKey);
  });

  it.each([
    [ShipmentOptionName.Signature, PRICE_SIGNATURE],
    [ShipmentOptionName.OnlyRecipient, PRICE_ONLY_RECIPIENT],
  ] as const)('returns price key for shipment option %s', (shipmentOption, priceKey) => {
    expect(getConfigPriceKey(shipmentOption)).toBe(priceKey);
  });

  it.each([[ShipmentOptionName.CooledDelivery], ['foo']] as const)('throws error for invalid option %s', (option) => {
    // @ts-expect-error Invalid input on purpose
    expect(() => getConfigPriceKey(option)).toThrow();
  });
});
