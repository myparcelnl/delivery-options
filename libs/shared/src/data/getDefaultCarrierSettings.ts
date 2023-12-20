import {type CarrierSettings} from '../types';

export const getDefaultCarrierSettings = (): CarrierSettings => {
  return Object.freeze({
    allowDeliveryOptions: undefined,
    allowEveningDelivery: undefined,
    allowMondayDelivery: undefined,
    allowMorningDelivery: undefined,
    allowOnlyRecipient: undefined,
    allowPackageTypeDigitalStamp: undefined,
    allowPackageTypeMailbox: undefined,
    allowPickupLocations: undefined,
    allowSameDayDelivery: undefined,
    allowSaturdayDelivery: undefined,
    allowSignature: undefined,
    allowStandardDelivery: undefined,
    deliveryDaysWindow: undefined,
    dropOffDays: undefined,
    dropOffDelay: undefined,
    packageType: undefined,
    priceEveningDelivery: undefined,
    priceMondayDelivery: undefined,
    priceMorningDelivery: undefined,
    priceOnlyRecipient: undefined,
    pricePackageTypeDigitalStamp: undefined,
    pricePackageTypeMailbox: undefined,
    pricePickup: undefined,
    priceSameDayDelivery: undefined,
    priceSaturdayDelivery: undefined,
    priceSignature: undefined,
    priceStandardDelivery: undefined,
    showDeliveryDate: undefined,
  });
};
