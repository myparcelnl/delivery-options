import {get} from '@vueuse/core';
import {
  AddressField,
  CarrierSetting,
  DELIVERY_DAYS_WINDOW,
  DELIVERY_DAYS_WINDOW_MIN,
  DROP_OFF_DAYS,
  DROP_OFF_DELAY,
  DROP_OFF_DELAY_MIN,
  useDeliveryOptionsStore,
} from '@myparcel-do/shared';
import {type EndpointParameters, type GetDeliveryOptions} from '@myparcel/sdk';
import {PackageTypeName, PlatformName} from '@myparcel/constants';
import {type ResolvedCarrier} from '../types';
import {calculateCutoffTime} from './calculateCutoffTime';

export const createGetDeliveryOptionsParameters = (
  carrier: ResolvedCarrier,
): EndpointParameters<GetDeliveryOptions> => {
  const store = useDeliveryOptionsStore();

  const {config, address} = store.configuration;

  return {
    platform: config.platform ?? PlatformName.MyParcel,
    carrier: carrier.name,
    package_type: config.packageType ?? PackageTypeName.Package,

    cutoff_time: calculateCutoffTime(carrier),
    deliverydays_window: carrier.get(DELIVERY_DAYS_WINDOW, DELIVERY_DAYS_WINDOW_MIN),
    dropoff_days: carrier.get(DROP_OFF_DAYS, [])?.join(';'),
    dropoff_delay: carrier.get(DROP_OFF_DELAY, DROP_OFF_DELAY_MIN),

    // @ts-expect-error todo
    monday_delivery: get(carrier.features).has(CarrierSetting.AllowMondayDelivery),
    // @ts-expect-error todo
    saturday_delivery: get(carrier.features).has(CarrierSetting.AllowSaturdayDelivery),

    cc: address?.[AddressField.Cc] ?? '',
    city: address?.[AddressField.City] ?? '',
    postal_code: address?.[AddressField.PostalCode] ?? '',
    street: address?.[AddressField.Street] ?? '',

    include: 'shipment_options',
  };
};
