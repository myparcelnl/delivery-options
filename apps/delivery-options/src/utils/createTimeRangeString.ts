import {toTime} from './toTime';

export const createTimeRangeString = (date: string, date2: string): string => {
  return [date, date2].map((date) => toTime(date)).join(' – ');
};
