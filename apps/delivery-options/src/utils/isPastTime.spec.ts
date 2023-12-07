import {afterEach, describe, expect, it, vi} from 'vitest';
import {splitTimestamp} from './splitTimestamp';
import {isPastTime} from './isPastTime';

describe('isPastTime function', () => {
  afterEach(() => {
    vi.setSystemTime(vi.getRealSystemTime());
  });

  it.each`
    currentTime | checkTime  | passed
    ${'00:00'}  | ${'09:30'} | ${false}
    ${'09:29'}  | ${'09:30'} | ${false}
    ${'09:30'}  | ${'09:30'} | ${true}
    ${'12:00'}  | ${'09:30'} | ${true}
    ${'12:00'}  | ${'12:30'} | ${false}
  `('returns $passed when checking if $currentTime is past $checkTime', ({currentTime, checkTime, passed}) => {
    const [hours, minutes] = splitTimestamp(currentTime);

    const date = new Date(vi.getRealSystemTime());

    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));

    vi.setSystemTime(date);

    expect(isPastTime(checkTime)).toBe(passed);
  });
});
