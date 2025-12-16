import {type DateLike} from '@vueuse/core';
import {type DeliveryTimeFrame} from '@myparcel-dev/sdk';
import {createTimestamp} from '../../utils';

export const createDeliveryTimeframe = <T extends 'start' | 'end' = 'start' | 'end'>(
  date: DateLike,
  type: T,
): DeliveryTimeFrame<T> => {
  return {
    type,
    date_time: createTimestamp(date),
  };
};
