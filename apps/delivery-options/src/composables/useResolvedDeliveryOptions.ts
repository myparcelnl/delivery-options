import {asyncComputed, get, useMemoize} from '@vueuse/core';
import {useDeliveryOptionsRequest} from '@myparcel-do/shared';
import {createGetDeliveryOptionsParameters, createTimeRangeString} from '../utils';
import {type ResolvedDeliveryOptions} from '../types';
import {useActiveCarriers} from './useActiveCarriers';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useResolvedDeliveryOptions = useMemoize(() => {
  const carriers = useActiveCarriers();

  return asyncComputed(async () => {
    const allCarrierPossibilities: ResolvedDeliveryOptions[] = [];

    await Promise.all(
      get(carriers)
        .filter((carrier) => get(carrier.hasDelivery))
        .map(async (carrier) => {
          const params = createGetDeliveryOptionsParameters(carrier);
          const query = useDeliveryOptionsRequest(params);

          await query.load();

          const carrierDates = get(query.data) ?? [];

          carrierDates?.forEach((dateOption) => {
            dateOption.possibilities.forEach((datePossibility) => {
              const [start, end] = datePossibility.delivery_time_frames;

              allCarrierPossibilities.push({
                carrier,
                date: dateOption.date.date,
                time: createTimeRangeString(start.date_time.date, end.date_time.date),
                deliveryType: datePossibility.type,
                packageType: datePossibility.package_type,
                shipmentOptions: datePossibility.shipment_options,
              });
            });
          });
        }),
    );

    return allCarrierPossibilities;
  });
});
