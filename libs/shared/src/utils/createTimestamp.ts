import {format} from 'date-fns';
import {type DateLike, normalizeDate} from '@vueuse/core';
import {type Timestamp} from '@myparcel/sdk';
import {DEFAULT_TIMEZONE, DEFAULT_TIMEZONE_TYPE, API_DATE_FORMAT} from '../data';

export const createTimestamp = (date: DateLike): Timestamp => {
  return {
    date: format(normalizeDate(date), API_DATE_FORMAT),
    timezone: DEFAULT_TIMEZONE,
    timezone_type: DEFAULT_TIMEZONE_TYPE,
  };
};
