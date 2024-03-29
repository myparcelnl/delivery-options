import {type ExtraDelivery, type ResolvedMockDeliveryOptionsParameters} from '../../types';
import {CarrierSetting, DAY_FRIDAY, DAY_MONDAY, DAY_SATURDAY, DeprecatedCarrierSetting} from '../../../data';
import {type UseCarrier} from '../../../composables';

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
  carrierInstance: UseCarrier,
): ExtraDelivery | undefined => {
  return extraDeliveryConfig.find((setting) => {
    const isToday = setting.deliveryDay === dayOfWeek;
    const hasDropOffDay = dropOffDays?.includes(setting.dropOffDay);
    const carrierHasFeature = carrierInstance.features.value.has(setting.feature);

    return isToday && hasDropOffDay && carrierHasFeature;
  });
};
