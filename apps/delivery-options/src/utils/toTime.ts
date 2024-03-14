import {padTime} from './padTime';

export const toTime = (date: Date | string): string => {
  if (date instanceof Date) {
    return `${padTime(date.getHours())}:${padTime(date.getMinutes())}`;
  }

  return toTime(new Date(date));
};
