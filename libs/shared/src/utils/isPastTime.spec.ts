import {afterEach, describe, expect, it, vi} from 'vitest';
import {type TimestampString} from '../types';
import {splitTimestamp} from './splitTimestamp';
import {isPastTime} from './isPastTime';

const createDateFromTimestamp = (currentTime: TimestampString): Date => {
  const [hours, minutes] = splitTimestamp(currentTime);

  const date = new Date(vi.getRealSystemTime());

  date.setHours(Number(hours));
  date.setMinutes(Number(minutes));
  return date;
};

const TABLE = [
  ['00:00', '00:00', true],
  ['00:00', '09:30', false],
  ['07:45', '12:30', false],
  ['09:29', '09:30', false],
  ['09:30', '09:30', true],
  ['12:45', '09:30', true],
  ['13:00', '09:30', true],
] as const;

describe('isPastTime', () => {
  afterEach(() => {
    vi.setSystemTime(vi.getRealSystemTime());
  });

  it.each(TABLE)('%s >= %s = %s (system time)', (currentTime, checkTime, passed) => {
    const now = createDateFromTimestamp(currentTime);

    vi.setSystemTime(now);

    expect(isPastTime(checkTime)).toBe(passed);
  });

  it.each(TABLE)('%s >= %s = %s (parameter)', (currentTime, checkTime, passed) => {
    const now = createDateFromTimestamp(currentTime);

    expect(isPastTime(checkTime, now)).toBe(passed);
  });
});
