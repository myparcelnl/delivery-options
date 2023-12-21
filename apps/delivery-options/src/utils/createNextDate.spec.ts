import {describe, expect, it, vi} from 'vitest';
import {normalizeDate} from '@vueuse/core';
import {
  DAY_FRIDAY,
  DAY_MONDAY,
  DAY_SATURDAY,
  DAY_SUNDAY,
  DAY_THURSDAY,
  DAY_TUESDAY,
  DAY_WEDNESDAY,
} from '@myparcel-do/shared';
import {createNextDate} from './createNextDate';

// Wednesday
const TODAY = '2023-12-27';

describe('createNextDate', () => {
  it.each([
    ['today', DAY_WEDNESDAY, TODAY],
    ['tomorrow', DAY_THURSDAY, '2023-12-28'],
    ['friday', DAY_FRIDAY, '2023-12-29'],
    ['saturday', DAY_SATURDAY, '2023-12-30'],
    ['sunday', DAY_SUNDAY, '2023-12-31'],
    ['next monday', DAY_MONDAY, '2024-01-01'],
    ['next tuesday', DAY_TUESDAY, '2024-01-02'],
  ])('returns %s when today is wed and day %i is passed', (_, weekday, expected) => {
    const now = normalizeDate(TODAY);

    vi.setSystemTime(now);

    expect(createNextDate(weekday)).toEqual(normalizeDate(expected));
  });
});
