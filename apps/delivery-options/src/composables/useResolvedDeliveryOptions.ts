/* eslint-disable max-nested-callbacks */
import {toValue} from 'vue';
import {useMemoize} from '@vueuse/core';
import {useDeliveryOptionsRequest, computedAsync} from '@myparcel-do/shared';
import {createGetDeliveryOptionsParameters, getResolvedDeliveryType} from '../utils';
import {type SelectedDeliveryMoment} from '../types';
import {useTimeRange} from './useTimeRange';
import {useActiveCarriers} from './useActiveCarriers';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useResolvedDeliveryOptions = useMemoize(() => {
  const carriers = useActiveCarriers();

  return computedAsync(async () => {
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
});
