import MockDate from 'mockdate';
import { dayjs } from '@Tests/dayjs';
import { isPastTime } from '@/delivery-options/config/isPastTime';

describe('isPastTime function', () => {
  test.each`
   currentTime   | cutOffTime | passed
   ${'00:00'}    | ${'09:30'} | ${false}
   ${'09:29'}    | ${'09:30'} | ${false}
   ${'09:30'}    | ${'09:30'} | ${true}
   ${'09:30:01'} | ${'09:30'} | ${true}
   ${'09:30:59'} | ${'09:31'} | ${false}
   ${'12:00'}    | ${'09:30'} | ${true}
   ${'12:00'}    | ${'12:30'} | ${false}
  `('if current time is $currentTime and cutoff is $cutOffTime, isPastTime should return $passed',
    ({ currentTime, cutOffTime, passed }) => {
      const [hours, minutes, seconds] = currentTime.split(':');
      const date = dayjs()
        .set('h', hours)
        .set('m', minutes)
        .set('s', seconds ?? 0);

      MockDate.set(date.toDate());
      expect(isPastTime(cutOffTime)).toEqual(passed);
      MockDate.reset();
    });
});
