import {type TimestampString} from '@myparcel-do/shared';
import {splitTimestamp} from './splitTimestamp';

export const isPastTime = (time: TimestampString): boolean => {
  const [hours, minutes] = splitTimestamp(time);

  const now = new Date();

  const isPastHour = now.getHours() > Number(hours);
  const isPastMinute = now.getMinutes() >= Number(minutes);

  return isPastHour || isPastMinute;
};
