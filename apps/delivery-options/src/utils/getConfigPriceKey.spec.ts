import {describe, expect, it} from 'vitest';
import {CarrierSetting} from '@myparcel-do/shared';
import {DeliveryTypeName, ShipmentOptionName} from '@myparcel/constants';
import {getConfigPriceKey} from './getConfigPriceKey';

describe('getConfigPriceKey', () => {
  it.each([
    [DeliveryTypeName.Standard, CarrierSetting.PriceStandardDelivery],
    [DeliveryTypeName.Evening, CarrierSetting.PriceEveningDelivery],
    [DeliveryTypeName.Morning, CarrierSetting.PriceMorningDelivery],
    [DeliveryTypeName.Pickup, CarrierSetting.PricePickup],
  ] as const)('returns price key for delivery type %s', (deliveryType, priceKey) => {
    expect(getConfigPriceKey(deliveryType)).toBe(priceKey);
  });

  it.each([
    [ShipmentOptionName.Signature, CarrierSetting.PriceSignature],
    [ShipmentOptionName.OnlyRecipient, CarrierSetting.PriceOnlyRecipient],
  ] as const)('returns price key for shipment option %s', (shipmentOption, priceKey) => {
    expect(getConfigPriceKey(shipmentOption)).toBe(priceKey);
  });

  it.each([[ShipmentOptionName.CooledDelivery], ['foo']] as const)('throws error for invalid option %s', (option) => {
    // @ts-expect-error Invalid input on purpose
    expect(() => getConfigPriceKey(option)).toThrow();
  });
});
