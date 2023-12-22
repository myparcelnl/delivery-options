import {type ConfigKey} from '../types';
import {CarrierSetting, ConfigSetting} from '../enums';

type DeliveryOptionsFeature = readonly ConfigKey[];

export const FEATURES_DELIVERY: DeliveryOptionsFeature = Object.freeze([
  CarrierSetting.AllowDeliveryOptions,
  CarrierSetting.PriceStandardDelivery,
]);

export const FEATURES_EVENING_DELIVERY: DeliveryOptionsFeature = Object.freeze([
  CarrierSetting.AllowEveningDelivery,
  CarrierSetting.PriceEveningDelivery,
]);

export const FEATURES_MONDAY_DELIVERY: DeliveryOptionsFeature = Object.freeze([CarrierSetting.AllowMondayDelivery]);

export const FEATURES_MORNING_DELIVERY: DeliveryOptionsFeature = Object.freeze([
  CarrierSetting.AllowMorningDelivery,
  CarrierSetting.PriceMorningDelivery,
]);

export const FEATURES_ONLY_RECIPIENT: DeliveryOptionsFeature = Object.freeze([
  CarrierSetting.PriceOnlyRecipient,
  CarrierSetting.AllowOnlyRecipient,
]);

export const FEATURES_PACKAGE_TYPE_DIGITAL_STAMP: DeliveryOptionsFeature = Object.freeze([
  CarrierSetting.AllowPackageTypeDigitalStamp,
]);

export const FEATURES_PACKAGE_TYPE_MAILBOX: DeliveryOptionsFeature = Object.freeze([
  CarrierSetting.AllowPackageTypeMailbox,
]);

export const FEATURES_PICKUP: DeliveryOptionsFeature = Object.freeze([
  CarrierSetting.AllowPickupLocations,
  CarrierSetting.PricePickup,
]);

export const FEATURES_SATURDAY_DELIVERY: DeliveryOptionsFeature = Object.freeze([CarrierSetting.AllowSaturdayDelivery]);

export const FEATURES_SIGNATURE: DeliveryOptionsFeature = Object.freeze([
  CarrierSetting.AllowSignature,
  CarrierSetting.PriceSignature,
]);

export const FEATURES_SHOW_DELIVERY_DATE: DeliveryOptionsFeature = Object.freeze([ConfigSetting.ShowDeliveryDate]);

export const FEATURES_DROP_OFF_DAYS: DeliveryOptionsFeature = Object.freeze([CarrierSetting.DropOffDays]);

export const FEATURES_DROP_OFF_DELAY: DeliveryOptionsFeature = Object.freeze([CarrierSetting.DropOffDelay]);

export const FEATURES_DELIVERY_DAYS_WINDOW: DeliveryOptionsFeature = Object.freeze([CarrierSetting.DeliveryDaysWindow]);

export const FEATURES_CUTOFF_TIME: DeliveryOptionsFeature = Object.freeze([CarrierSetting.CutoffTime]);

export const FEATURES_SAME_DAY_DELIVERY: DeliveryOptionsFeature = Object.freeze([
  CarrierSetting.AllowSameDayDelivery,
  CarrierSetting.PriceSameDayDelivery,
  CarrierSetting.CutoffTimeSameDay,
]);

export const FEATURE_GROUPS = Object.freeze([
  FEATURES_DELIVERY,
  FEATURES_EVENING_DELIVERY,
  FEATURES_MONDAY_DELIVERY,
  FEATURES_MORNING_DELIVERY,
  FEATURES_ONLY_RECIPIENT,
  FEATURES_PACKAGE_TYPE_DIGITAL_STAMP,
  FEATURES_PACKAGE_TYPE_MAILBOX,
  FEATURES_PICKUP,
  FEATURES_SATURDAY_DELIVERY,
  FEATURES_SIGNATURE,
  FEATURES_SHOW_DELIVERY_DATE,
  FEATURES_DROP_OFF_DAYS,
  FEATURES_DROP_OFF_DELAY,
  FEATURES_DELIVERY_DAYS_WINDOW,
  FEATURES_CUTOFF_TIME,
  FEATURES_SAME_DAY_DELIVERY,
]) satisfies readonly DeliveryOptionsFeature[];
