import {type Dayjs} from 'dayjs';
import {createCutoffTimeDate} from '../../legacy';
import {type TimestampString} from '../../../types';

export const cutoffTimeHasPassed = (cutoffTime: TimestampString, date: Dayjs): boolean => {
  const cutOffTimeDate = createCutoffTimeDate(cutoffTime, date);

  return !date.isBefore(cutOffTimeDate);
};
