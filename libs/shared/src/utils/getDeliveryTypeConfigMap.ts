import {DeliveryTypeName} from '@myparcel/constants';
import {CustomDeliveryType, type SupportedDeliveryTypeName} from '../types';
import {CarrierSetting} from '../data';

export const getDeliveryTypeConfigMap = (): Record<SupportedDeliveryTypeName, CarrierSetting> => ({
  [DeliveryTypeName.Standard]: CarrierSetting.AllowStandardDelivery,
  [DeliveryTypeName.Evening]: CarrierSetting.AllowEveningDelivery,
  [DeliveryTypeName.Morning]: CarrierSetting.AllowMorningDelivery,
  [DeliveryTypeName.Pickup]: CarrierSetting.AllowPickupLocations,
  [CustomDeliveryType.SameDay]: CarrierSetting.AllowSameDayDelivery,
  [CustomDeliveryType.Monday]: CarrierSetting.AllowMondayDelivery,
  [CustomDeliveryType.Saturday]: CarrierSetting.AllowSaturdayDelivery,
});
