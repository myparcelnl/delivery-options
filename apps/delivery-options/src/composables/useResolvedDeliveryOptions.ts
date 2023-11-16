import {get} from '@vueuse/core';
import {AddressField, useDeliveryOptions, useDeliveryOptionsConfig, useOutput} from '@myparcel-do/shared';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useResolvedDeliveryOptions = () => {
  const config = useDeliveryOptionsConfig();
  const output = useOutput();

  const values = get(output.values);

  const {address} = config.data;

  const configuration = config?.data?.config ?? {};

  // todo
  return {};

  return useDeliveryOptions({
    platform: configuration.platform,
    carrier: values.carrier,
    package_type: configuration.packageType,

    dropoff_days: configuration.dropOffDays,
    dropoff_delay: Number(configuration.dropOffDelay),

    cc: address?.[AddressField.Cc] ?? '',
    city: address?.[AddressField.City] ?? '',
    postal_code: address?.[AddressField.PostalCode] ?? '',
    street: address?.[AddressField.Street] ?? '',
  });
};
