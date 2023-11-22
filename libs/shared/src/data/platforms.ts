import {BELGIUM, FRANCE, GERMANY, NETHERLANDS} from '@myparcel/constants/countries';
import {CarrierName, DeliveryTypeName, PackageTypeName} from '@myparcel/constants';
import {type PlatformOptions} from '../types';
import {SubscriptionType} from '../constants';
import {ALLOW_SAME_DAY_DELIVERY} from './configKeys';

// eslint-disable-next-line max-lines-per-function
export const configMyParcel = (): PlatformOptions => {
  return {
    carriers: [
      {
        name: CarrierName.PostNl,
        subscription: SubscriptionType.Optional,
        packageTypes: [
          PackageTypeName.Package,
          PackageTypeName.Mailbox,
          PackageTypeName.DigitalStamp,
          PackageTypeName.Letter,
        ],
        deliveryTypes: [
          DeliveryTypeName.Standard,
          DeliveryTypeName.Morning,
          DeliveryTypeName.Evening,
          DeliveryTypeName.Pickup,
        ],
        deliveryCountries: [NETHERLANDS, BELGIUM],
        pickupCountries: [NETHERLANDS, BELGIUM],
        features: [],
      },
      {
        name: CarrierName.DhlForYou,
        subscription: SubscriptionType.Optional,
        packageTypes: [PackageTypeName.Package],
        deliveryTypes: [DeliveryTypeName.Standard],
        deliveryCountries: [NETHERLANDS, BELGIUM],
        pickupCountries: [NETHERLANDS, BELGIUM],
        features: [ALLOW_SAME_DAY_DELIVERY],
      },
      {
        name: CarrierName.DhlParcelConnect,
        subscription: SubscriptionType.Optional,
        packageTypes: [PackageTypeName.Package],
        deliveryTypes: [DeliveryTypeName.Standard],
        deliveryCountries: [BELGIUM, FRANCE, GERMANY],
        pickupCountries: [BELGIUM, FRANCE, GERMANY],
        features: [],
      },
      {
        name: CarrierName.DhlEuroPlus,
        subscription: SubscriptionType.Optional,
        packageTypes: [PackageTypeName.Package],
        deliveryTypes: [DeliveryTypeName.Standard],
        deliveryCountries: [BELGIUM, FRANCE, GERMANY],
        pickupCountries: [BELGIUM, FRANCE, GERMANY],
        features: [],
      },
      {
        name: CarrierName.Ups,
        subscription: SubscriptionType.Required,
        packageTypes: [PackageTypeName.Package],
        deliveryTypes: [DeliveryTypeName.Standard],
        deliveryCountries: [BELGIUM],
        pickupCountries: [BELGIUM],
        features: [],
      },
      {
        name: CarrierName.Dpd,
        subscription: SubscriptionType.Required,
        packageTypes: [PackageTypeName.Package],
        deliveryTypes: [DeliveryTypeName.Standard],
        deliveryCountries: [NETHERLANDS, BELGIUM],
        pickupCountries: [NETHERLANDS, BELGIUM],
        features: [],
      },
    ],
  };
};

export const configSendMyParcel = (): PlatformOptions => {
  return {
    carriers: [
      {
        name: CarrierName.Bpost,
        subscription: SubscriptionType.Never,
        packageTypes: [PackageTypeName.Package],
        deliveryTypes: [DeliveryTypeName.Standard],
        deliveryCountries: [BELGIUM, NETHERLANDS],
        pickupCountries: [BELGIUM, NETHERLANDS],
        features: [],
      },
      {
        name: CarrierName.PostNl,
        subscription: SubscriptionType.Never,
        packageTypes: [PackageTypeName.Package],
        deliveryTypes: [DeliveryTypeName.Standard],
        deliveryCountries: [BELGIUM, NETHERLANDS],
        pickupCountries: [BELGIUM, NETHERLANDS],
        features: [],
      },
      {
        name: CarrierName.Dpd,
        subscription: SubscriptionType.Never,
        packageTypes: [PackageTypeName.Package],
        deliveryTypes: [DeliveryTypeName.Standard],
        deliveryCountries: [BELGIUM, NETHERLANDS],
        pickupCountries: [BELGIUM, NETHERLANDS],
        features: [],
      },
    ],
  };
};
