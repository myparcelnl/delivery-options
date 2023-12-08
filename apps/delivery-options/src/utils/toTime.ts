import {padStart} from './padStart';

const DATE_PADDING = 2;

export const toTime = (date: Date | string): string => {
  if (date instanceof Date) {
    return `${padStart(date.getHours(), DATE_PADDING)}:${padStart(date.getMinutes(), DATE_PADDING)}`;
  }

  return toTime(new Date(date));
};
