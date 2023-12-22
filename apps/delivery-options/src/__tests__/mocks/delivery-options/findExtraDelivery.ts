import {type ExtraDelivery, type ResolvedMockDeliveryOptionsParameters} from '@myparcel-do/shared/testing';
import {
  CarrierSetting,
  DAY_FRIDAY,
  DAY_MONDAY,
  DAY_SATURDAY,
  DeprecatedCarrierSetting,
  type FullCarrier,
} from '@myparcel-do/shared';

/**
 * Settings for extra delivery days.
 */
export const extraDeliveryConfig = Object.freeze([
  {
    cutoffTime: DeprecatedCarrierSetting.SaturdayCutoffTime,
    deliveryDay: DAY_MONDAY,
    dropOffDay: DAY_SATURDAY,
    feature: CarrierSetting.AllowMondayDelivery,
  },
  {
    cutoffTime: DeprecatedCarrierSetting.FridayCutoffTime,
    deliveryDay: DAY_SATURDAY,
    dropOffDay: DAY_FRIDAY,
    feature: CarrierSetting.AllowSaturdayDelivery,
  },
]) satisfies readonly ExtraDelivery[];

export const findExtraDelivery = (
  {dropOffDays}: ResolvedMockDeliveryOptionsParameters,
  dayOfWeek: number,
  fullCarrier: FullCarrier,
): ExtraDelivery | undefined => {
  return extraDeliveryConfig.find((setting) => {
    const isToday = setting.deliveryDay === dayOfWeek;
    const hasDropOffDay = dropOffDays?.includes(setting.dropOffDay);
    const carrierHasFeature = fullCarrier.hasFeature(setting.feature);

    return isToday && hasDropOffDay && carrierHasFeature;
  });
};
