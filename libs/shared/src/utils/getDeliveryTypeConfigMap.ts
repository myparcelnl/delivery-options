import {DeliveryTypeName} from '@myparcel/constants';
import {CustomDeliveryType, type SupportedDeliveryTypeName} from '../types';
import {CarrierSetting} from '../enums';

export const getDeliveryTypeConfigMap = (): Record<SupportedDeliveryTypeName, CarrierSetting> => ({
  [DeliveryTypeName.Standard]: CarrierSetting.AllowDeliveryOptions,
  [DeliveryTypeName.Evening]: CarrierSetting.AllowEveningDelivery,
  [DeliveryTypeName.Morning]: CarrierSetting.AllowMorningDelivery,
  [DeliveryTypeName.Pickup]: CarrierSetting.AllowPickupLocations,
  [CustomDeliveryType.SameDay]: CarrierSetting.AllowSameDayDelivery,
});
