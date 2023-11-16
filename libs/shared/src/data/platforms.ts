import {CarrierName} from '@myparcel/constants';
import {SubscriptionType} from '../constants';

export interface CarrierOptions {
  deliveryCountries?: string[];
  deliveryTypes?: string[];
  features?: string[];
  name: CarrierName;
  packageTypes?: string[];
  pickupCountries?: string[];
  shipmentOptions?: string[];
  subscription: SubscriptionType;
}

export interface PlatformOptions {
  carriers: CarrierOptions[];
  features?: string[];
}

export const configMyParcel = (): PlatformOptions => {
  return {
    carriers: [
      {
        name: CarrierName.PostNl,
        subscription: SubscriptionType.Optional,
      },
      {
        name: CarrierName.DhlForYou,
        subscription: SubscriptionType.Optional,
      },
      {
        name: CarrierName.DhlParcelConnect,
        subscription: SubscriptionType.Optional,
      },
      {
        name: CarrierName.DhlEuroPlus,
        subscription: SubscriptionType.Optional,
      },
      {
        name: CarrierName.Ups,
        subscription: SubscriptionType.Required,
      },
      {
        name: CarrierName.Dpd,
        subscription: SubscriptionType.Required,
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
      },
      {
        name: CarrierName.PostNl,
        subscription: SubscriptionType.Never,
      },
      {
        name: CarrierName.Dpd,
        subscription: SubscriptionType.Never,
      },
    ],
  };
};
