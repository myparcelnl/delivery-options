import {toValue} from 'vue';
import {getDay} from 'date-fns';
import {
  CarrierSetting,
  CUTOFF_TIME_DEFAULT,
  type TimestampString,
  CUTOFF_TIME_SAME_DAY_DEFAULT,
  type DropOffEntryObject,
  CustomDeliveryType,
} from '@myparcel-dev/do-shared';
import {type UseResolvedCarrier} from '../composables';

const getDefaultCutoffTime = (carrier: UseResolvedCarrier): TimestampString => {
  return carrier.get(CarrierSetting.CutoffTime, CUTOFF_TIME_DEFAULT) as TimestampString;
};

const getSameDayCutoffTime = (carrier: UseResolvedCarrier): TimestampString => {
  return carrier.get(CarrierSetting.CutoffTimeSameDay, CUTOFF_TIME_SAME_DAY_DEFAULT) as TimestampString;
};

export const calculateCutoffTime = (carrier: UseResolvedCarrier): TimestampString => {
  const dropOffDays = carrier.get(CarrierSetting.DropOffDays, []) as DropOffEntryObject[];

  const today = getDay(new Date());

  const dropOffDay = dropOffDays.find((dropOffDay) => today === Number(dropOffDay.weekday));

  if (toValue(carrier.deliveryTypes).has(CustomDeliveryType.SameDay)) {
    return dropOffDay?.[CarrierSetting.CutoffTimeSameDay] ?? getSameDayCutoffTime(carrier);
  }

  return dropOffDay?.cutoffTime ?? getDefaultCutoffTime(carrier);
};
