import {afterEach, describe, expect, it, vi} from 'vitest';
import {
  DAY_FRIDAY,
  DAY_MONDAY,
  DAY_SATURDAY,
  DAY_SUNDAY,
  DAY_THURSDAY,
  DAY_TUESDAY,
  DAY_WEDNESDAY,
} from '@myparcel-dev/do-shared';
import {createUtcDate} from './createUtcDate';
import {createNextDate} from './createNextDate';

describe('createNextDate', () => {
  afterEach(() => {
    vi.setSystemTime(vi.getRealSystemTime());
  });

  const TODAY = new Date(Date.UTC(2023, 11, 27));

  it.each([
    ['today', DAY_WEDNESDAY, TODAY],
    ['tomorrow', DAY_THURSDAY, '2023-12-28'],
    ['friday', DAY_FRIDAY, '2023-12-29'],
    ['saturday', DAY_SATURDAY, '2023-12-30'],
    ['sunday', DAY_SUNDAY, '2023-12-31'],
    ['next monday', DAY_MONDAY, '2024-01-01'],
    ['next tuesday', DAY_TUESDAY, '2024-01-02'],
  ])('returns %s when today is wed and day %i is passed', (_, weekday, expected) => {
    vi.setSystemTime(TODAY);

    expect(createNextDate(weekday)).toEqual(createUtcDate(expected));
  });
});
