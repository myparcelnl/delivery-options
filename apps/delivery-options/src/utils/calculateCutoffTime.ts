import {toValue} from 'vue';
import {getDay} from 'date-fns';
import {
  CarrierSetting,
  CUTOFF_TIME_DEFAULT,
  isPastTime,
  type TimestampString,
  CUTOFF_TIME_SAME_DAY_DEFAULT,
  type DropOffEntryObject,
  CustomDeliveryType,
} from '@myparcel-do/shared';
import {type UseResolvedCarrier} from '../composables';

const END_OF_DAY_CUTOFF_TIME = '23:59';

const getDefaultCutoffTime = (carrier: UseResolvedCarrier): TimestampString => {
  return carrier.get(CarrierSetting.CutoffTime, CUTOFF_TIME_DEFAULT) as TimestampString;
};

const getSameDayCutoffTime = (carrier: UseResolvedCarrier): TimestampString => {
  return carrier.get(CarrierSetting.CutoffTimeSameDay, CUTOFF_TIME_SAME_DAY_DEFAULT) as TimestampString;
};

export const calculateCutoffTime = (carrier: UseResolvedCarrier): TimestampString => {
  const dropOffDays = carrier.get(CarrierSetting.DropOffDays, []) as DropOffEntryObject[];
  const today = getDay(new Date());
  const dropOffDay = dropOffDays.find((dropOffDay) => today === dropOffDay.weekday);

  if (toValue(carrier.deliveryTypes).has(CustomDeliveryType.SameDay)) {
    const sameDayCutoffTime = dropOffDay?.[CarrierSetting.CutoffTimeSameDay] ?? getSameDayCutoffTime(carrier);

    return isPastTime(sameDayCutoffTime) ? END_OF_DAY_CUTOFF_TIME : sameDayCutoffTime;
  }

  return dropOffDay?.cutoffTime ?? getDefaultCutoffTime(carrier);
};
