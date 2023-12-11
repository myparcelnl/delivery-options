import {afterEach, describe, expect, test, vi} from 'vitest';
import {isPastTime} from '../../legacy';

describe.skip('isPastTime function', () => {
  afterEach(() => {
    vi.setSystemTime(vi.getRealSystemTime());
  });

  test.each`
    currentTime   | cutOffTime | passed
    ${'00:00'}    | ${'09:30'} | ${false}
    ${'09:29'}    | ${'09:30'} | ${false}
    ${'09:30'}    | ${'09:30'} | ${true}
    ${'09:30:01'} | ${'09:30'} | ${true}
    ${'09:30:59'} | ${'09:31'} | ${false}
    ${'12:00'}    | ${'09:30'} | ${true}
    ${'12:00'}    | ${'12:30'} | ${false}
    ${'12:00'}    | ${null}    | ${false}
  `(
    'if current time is $currentTime and cutoff is $cutOffTime, isPastTime should return $passed',
    ({currentTime, cutOffTime, passed}) => {
      const [hours, minutes, seconds] = currentTime.split(':');

      const date = new Date();
      date.setDate(1);
      date.setHours(hours);
      date.setMinutes(minutes);
      date.setSeconds(seconds ?? 0);

      vi.setSystemTime(date);
      expect(isPastTime(cutOffTime)).toEqual(passed);
    },
  );
});
