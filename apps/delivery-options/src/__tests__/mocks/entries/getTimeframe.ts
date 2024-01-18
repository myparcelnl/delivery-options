import {type DeliveryTimeFrame} from '@myparcel/sdk';

export const getTimeframe = <T extends 'start' | 'end' = 'start' | 'end'>(
  date: string,
  type: T,
): DeliveryTimeFrame<T> => {
  return {
    type,
    date_time: {
      date,
      timezone_type: 3,
      timezone: 'Europe/Amsterdam',
    },
  };
};
