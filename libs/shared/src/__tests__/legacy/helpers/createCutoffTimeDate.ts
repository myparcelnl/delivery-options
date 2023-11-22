import dayjs, {type Dayjs} from 'dayjs';
import {type TimestampString} from '../../../types';

export const createCutoffTimeDate = (cutoffTime: TimestampString, date: Dayjs = dayjs()): Dayjs => {
  const [hour, minute] = cutoffTime.split(':');

  return date.set('h', parseInt(hour)).set('m', parseInt(minute));
};
