import {type TimestampString} from '../types';
import {splitTimestamp} from './splitTimestamp';

export const isPastTime = (time: TimestampString, now: Date = new Date()): boolean => {
  const [hours, minutes] = splitTimestamp(time);

  const isPastHour = now.getHours() > Number(hours);
  const isPastMinute = now.getMinutes() >= Number(minutes);

  return isPastHour || isPastMinute;
};
