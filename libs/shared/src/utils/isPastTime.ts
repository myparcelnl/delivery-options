import {getHours, getMinutes} from 'date-fns';
import {type TimestampString} from '../types';
import {splitTimestamp} from './splitTimestamp';

const MINUTES_TO_HOURS = 60;

export const isPastTime = (time: TimestampString, now: Date = new Date()): boolean => {
  const [hours, minutes] = splitTimestamp(time);

  const nowMinutes = getHours(now) * MINUTES_TO_HOURS + getMinutes(now);
  const timeMinutes = Number(hours) * MINUTES_TO_HOURS + Number(minutes);

  return nowMinutes >= timeMinutes;
};
