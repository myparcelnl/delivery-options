import {type ExtraDelivery, type ResolvedMockDeliveryOptionsParameters} from '@myparcel-do/shared/testing';
import {
  ALLOW_MONDAY_DELIVERY,
  ALLOW_SATURDAY_DELIVERY,
  DAY_FRIDAY,
  DAY_MONDAY,
  DAY_SATURDAY,
  FRIDAY_CUTOFF_TIME,
  type FullCarrier,
  SATURDAY_CUTOFF_TIME,
} from '@myparcel-do/shared';

/**
 * Settings for extra delivery days.
 */
export const extraDeliveryConfig = Object.freeze([
  {
    cutoffTime: SATURDAY_CUTOFF_TIME,
    deliveryDay: DAY_MONDAY,
    dropOffDay: DAY_SATURDAY,
    feature: ALLOW_MONDAY_DELIVERY,
  },
  {
    cutoffTime: FRIDAY_CUTOFF_TIME,
    deliveryDay: DAY_SATURDAY,
    dropOffDay: DAY_FRIDAY,
    feature: ALLOW_SATURDAY_DELIVERY,
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
