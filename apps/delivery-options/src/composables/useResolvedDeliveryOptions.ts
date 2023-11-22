import {type DeepReadonly} from 'vue';
import {asyncComputed, get} from '@vueuse/core';
import {type DeliveryOptionsCarrier, useActiveCarriers, useDeliveryOptions} from '@myparcel-do/shared';
import {type DeliveryOption} from '@myparcel/sdk';
import {type DeliveryTypeName, type PackageTypeName} from '@myparcel/constants';
import {createGetDeliveryOptionsParameters} from '../utils/createGetDeliveryOptionsParameters';
import {createTimeRangeString} from '../utils';

export interface ResolvedDeliveryOptions {
  carrier: DeliveryOptionsCarrier;
  date: string;
  deliveryType: DeliveryTypeName;
  packageType: PackageTypeName;
  shipmentOptions: DeepReadonly<DeliveryOption['possibilities'][number]['shipment_options']>;
  time: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useResolvedDeliveryOptions = () => {
  const carriers = useActiveCarriers();

  return asyncComputed(async () => {
    const allCarrierPossibilities: ResolvedDeliveryOptions[] = [];

    await Promise.all(
      carriers.data.value.map(async (carrier) => {
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
