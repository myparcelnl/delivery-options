import {PlatformName} from '@myparcel/constants';

export enum SubscriptionType {
  Required = 1,
  Never = 0,
  Optional = -1,
}

export const DEFAULT_PLATFORM = PlatformName.MyParcel;
