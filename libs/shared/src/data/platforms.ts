import {CarrierName} from '@myparcel/constants';
import {type PlatformOptions} from '../types';
import {SubscriptionType} from '../constants';

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
