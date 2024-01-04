/* eslint-disable max-nested-callbacks */
import {asyncComputed, get, useMemoize} from '@vueuse/core';
import {type UnionExcept, useDeliveryOptionsRequest} from '@myparcel-do/shared';
import {type DeliveryTypeName} from '@myparcel/constants';
import {createGetDeliveryOptionsParameters, createTimeRangeString} from '../utils';
import {type SelectedDeliveryMoment} from '../types';
import {useAddressStore, useConfigStore} from '../stores';
import {useActiveCarriers} from './useActiveCarriers';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useResolvedDeliveryOptions = useMemoize(() => {
  const carriers = useActiveCarriers();
  const config = useConfigStore();
  const address = useAddressStore();

  const resolvedDates = asyncComputed(async () => {
    return Promise.all(
      get(carriers)
        .filter((carrier) => get(carrier.hasDelivery))
        .map(async (carrier) => {
          const params = createGetDeliveryOptionsParameters(carrier);
          const query = useDeliveryOptionsRequest(params);

          await query.load();

          return {
            carrier,
            dates: get(query.data) ?? [],
          };
        }),
    );
  });

  return asyncComputed(() => {
    return resolvedDates.value.reduce((acc, {carrier, dates}) => {
      dates?.forEach((dateOption) => {
        dateOption.possibilities.forEach((datePossibility) => {
          const [start, end] = datePossibility.delivery_time_frames;

          acc.push({
            carrier: carrier.identifier,
            date: dateOption.date.date,
            time: createTimeRangeString(start.date_time.date, end.date_time.date),
            deliveryType: datePossibility.type as UnionExcept<DeliveryTypeName, DeliveryTypeName.Pickup>,
            packageType: datePossibility.package_type,
            shipmentOptions: datePossibility.shipment_options,
          });
        });
      });

      return acc;
    }, [] as SelectedDeliveryMoment[]);
  });
});
