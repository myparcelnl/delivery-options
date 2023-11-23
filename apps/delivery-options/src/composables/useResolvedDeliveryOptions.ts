import {asyncComputed, get} from '@vueuse/core';
import {useActiveCarriers, useCarrierConfiguration, useDeliveryOptions} from '@myparcel-do/shared';
import {createGetDeliveryOptionsParameters} from '../utils/createGetDeliveryOptionsParameters';
import {createTimeRangeString} from '../utils';
import {type ResolvedDeliveryOptions} from '../types';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useResolvedDeliveryOptions = () => {
  const carriers = useActiveCarriers();

  return asyncComputed(async () => {
    const allCarrierPossibilities: ResolvedDeliveryOptions[] = [];

    await Promise.all(
      carriers.data.value
        .filter((carrier) => {
          const carrierConfig = useCarrierConfiguration(carrier.identifier);

          return carrierConfig.hasDeliveryInCountry();
        })
        .map(async (carrier) => {
          const params = createGetDeliveryOptionsParameters(carrier);
          const query = useDeliveryOptions(params);

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
};
