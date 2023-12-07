import {CarrierSetting, CustomDeliveryType, type SupportedDeliveryTypeName} from '@myparcel-do/shared';
import {DeliveryTypeName} from '@myparcel/constants';

export const getDeliveryTypeConfigMap = (): Record<SupportedDeliveryTypeName, CarrierSetting> => ({
  [DeliveryTypeName.Standard]: CarrierSetting.AllowDeliveryOptions,
  [DeliveryTypeName.Evening]: CarrierSetting.AllowEveningDelivery,
  [DeliveryTypeName.Morning]: CarrierSetting.AllowMorningDelivery,
  [DeliveryTypeName.Pickup]: CarrierSetting.AllowPickupLocations,
  [CustomDeliveryType.SameDay]: CarrierSetting.AllowSameDayDelivery,
});
