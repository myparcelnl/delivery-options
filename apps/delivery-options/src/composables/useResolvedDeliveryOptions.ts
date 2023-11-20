import {asyncComputed, get} from '@vueuse/core';
import {
  AddressField,
  type DeliveryOptionsCarrier,
  useActiveCarriers,
  useDeliveryOptions,
  useDeliveryOptionsStore,
} from '@myparcel-do/shared';
import {type DeliveryOption} from '@myparcel/sdk';
import {type DeliveryTypeName, type PackageTypeName} from '@myparcel/constants';

export interface ResolvedDeliveryOptions {
  carrier: DeliveryOptionsCarrier;
  date: string;
  deliveryType: DeliveryTypeName;
  packageType: PackageTypeName;
  shipmentOptions: DeliveryOption['possibilities'][number]['shipment_options'];
  time: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useResolvedDeliveryOptions = () => {
  const carriers = useActiveCarriers();
  const store = useDeliveryOptionsStore();

  const {configuration} = store;

  return asyncComputed(async () => {
    const allCarrierPossibilities: ResolvedDeliveryOptions[] = [];

    await Promise.all(
      get(carriers.data).map(async (carrier) => {
        const query = useDeliveryOptions({
          platform: configuration.config.platform,
          carrier: carrier.name,
          package_type: configuration.config.packageType,

          dropoff_days: configuration.config.dropOffDays?.join(','),
          dropoff_delay: Number(configuration.config.dropOffDelay),

          cc: configuration.address?.[AddressField.Cc] ?? '',
          city: configuration.address?.[AddressField.City] ?? '',
          postal_code: configuration.address?.[AddressField.PostalCode] ?? '',
          street: configuration.address?.[AddressField.Street] ?? '',
        });

        await query.suspense();

        const carrierDates = get(query.data);

        carrierDates?.forEach((dateOption) => {
          dateOption.possibilities.forEach((datePossibility) => {
            const [start, end] = datePossibility.delivery_time_frames;

            allCarrierPossibilities.push({
              carrier,
              date: dateOption.date.date,
              time: `${start.date_time.date} – ${end.date_time.date}`,
              deliveryType: datePossibility.type,
              packageType: datePossibility.package_type,
              shipmentOptions: datePossibility.shipment_options,
            });
          });
        });
      }),
    );

    console.log({allCarrierPossibilities});

    return allCarrierPossibilities;
  });
};
