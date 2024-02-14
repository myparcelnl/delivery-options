/* eslint-disable max-nested-callbacks */
import {toValue, computed} from 'vue';
import {useMemoize} from '@vueuse/core';
import {useDeliveryOptionsRequest, computedAsync, type ComputedAsync} from '@myparcel-do/shared';
import {createGetDeliveryOptionsParameters, getResolvedDeliveryType} from '../utils';
import {type SelectedDeliveryMoment} from '../types';
import {useTimeRange} from './useTimeRange';
import {useActiveCarriers} from './useActiveCarriers';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useResolvedDeliveryOptions = useMemoize(() => {
  const carriers = useActiveCarriers();

  const asyncComp = computedAsync(async () => {
    const resolvedDates = await Promise.all(
      toValue(carriers.value)
        .filter((carrier) => toValue(carrier.hasDelivery))
        .map(async (carrier) => {
          const params = createGetDeliveryOptionsParameters(carrier);
          const query = useDeliveryOptionsRequest(params);

          await query.load();

          return {carrier, dates: toValue(query.data) ?? []};
        }),
    );

    return resolvedDates.reduce((acc: SelectedDeliveryMoment[], {carrier, dates}) => {
      dates.forEach((dateOption) => {
        dateOption.possibilities.forEach((datePossibility) => {
          const [start, end] = datePossibility.delivery_time_frames;
          const timeRange = useTimeRange(start.date_time.date, end.date_time.date);

          acc.push({
            carrier: carrier.identifier,
            date: dateOption.date.date,
            time: timeRange.value,
            deliveryType: getResolvedDeliveryType(dateOption.date.date, datePossibility.type),
            packageType: datePossibility.package_type,
            shipmentOptions: datePossibility.shipment_options,
          });
        });
      });

      return acc;
    }, [] as SelectedDeliveryMoment[]);
  }, []);

  const final = computed(() => {
    return asyncComp.value.filter((option) => {
      const carrier = carriers.value.find((carrier) => carrier.name === option.carrier);

      return carrier?.allowedDeliveryTypes.value.has(option.deliveryType);
    });
  });

  Object.defineProperty(final, 'loading', asyncComp.loading);

  return final as ComputedAsync<(typeof final)['value']>;
});
