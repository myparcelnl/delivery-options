import {CarrierSetting, CUTOFF_TIME, CUTOFF_TIME_DEFAULT, type TimestampString} from '@myparcel-do/shared';
import {type ResolvedCarrier} from '../types';
import {isPastTime} from './isPastTime';

export const calculateCutoffTime = (carrier: ResolvedCarrier): TimestampString => {
  const hasSameDayDelivery = carrier.get(CarrierSetting.AllowSameDayDelivery, false);

  if (hasSameDayDelivery) {
    const sameDayCutoffTime = carrier.get(CarrierSetting.CutoffTimeSameDay, CUTOFF_TIME_DEFAULT) as TimestampString;

    if (!isPastTime(sameDayCutoffTime)) {
      return sameDayCutoffTime;
    }
  }

  return carrier.get(CUTOFF_TIME, CUTOFF_TIME_DEFAULT) as TimestampString;
};
