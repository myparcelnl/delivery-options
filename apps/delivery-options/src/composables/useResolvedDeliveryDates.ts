import {asyncComputed, get} from '@vueuse/core';
import {type ResolvedDeliveryOptions, useResolvedDeliveryOptions} from './useResolvedDeliveryOptions';

export const useResolvedDeliveryDates = () => {
  const deliveryOptions = useResolvedDeliveryOptions();

  return asyncComputed(async () => {
    if (!get(deliveryOptions)) {
      return [];
    }

    return get(deliveryOptions).reduce((acc, option) => {
      if (!acc.some((item) => item.date === option.date)) {
        acc.push(option);
      }

      return acc;
    }, [] as ResolvedDeliveryOptions[]);
  });
};
