import {
  ALLOW_DELIVERY_OPTIONS,
  ALLOW_EVENING_DELIVERY,
  ALLOW_MORNING_DELIVERY,
  ALLOW_PICKUP_LOCATIONS,
  type CarrierSetting,
  type SupportedDeliveryTypeName,
} from '@myparcel-do/shared';
import {DeliveryTypeName} from '@myparcel/constants';

export const getDeliveryTypeConfigMap = (): Record<SupportedDeliveryTypeName, CarrierSetting> => ({
  [DeliveryTypeName.Standard]: ALLOW_DELIVERY_OPTIONS,
  [DeliveryTypeName.Evening]: ALLOW_EVENING_DELIVERY,
  [DeliveryTypeName.Morning]: ALLOW_MORNING_DELIVERY,
  [DeliveryTypeName.Pickup]: ALLOW_PICKUP_LOCATIONS,
});
