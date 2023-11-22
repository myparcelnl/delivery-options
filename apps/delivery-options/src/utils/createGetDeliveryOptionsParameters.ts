import {
  AddressField,
  CarrierSetting,
  DELIVERY_DAYS_WINDOW_MIN,
  type DeliveryOptionsCarrier,
  DROP_OFF_DELAY_MIN,
  useDeliveryOptionsStore,
} from '@myparcel-do/shared';
import {type EndpointParameters, type GetDeliveryOptions} from '@myparcel/sdk';
import {PackageTypeName, PlatformName} from '@myparcel/constants';
import {isEnabledForCarrier} from './isEnabledForCarrier';
import {calculateCutoffTime} from './calculateCutoffTime';

export const createGetDeliveryOptionsParameters = (
  carrier: DeliveryOptionsCarrier,
): EndpointParameters<GetDeliveryOptions> => {
  const store = useDeliveryOptionsStore();

  const {config, address} = store.configuration;

  return {
    platform: config.platform ?? PlatformName.MyParcel,
    carrier: carrier.name,
    package_type: config.packageType ?? PackageTypeName.Package,

    cutoff_time: calculateCutoffTime(carrier),
    deliverydays_window: Number(config.deliveryDaysWindow ?? DELIVERY_DAYS_WINDOW_MIN),
    dropoff_days: (config.dropOffDays ?? [])?.join(';'),
    dropoff_delay: Number(config.dropOffDelay ?? DROP_OFF_DELAY_MIN),

    monday_delivery: isEnabledForCarrier(carrier, CarrierSetting.AllowMondayDelivery),
    saturday_delivery: isEnabledForCarrier(carrier, CarrierSetting.AllowSaturdayDelivery),

    cc: address?.[AddressField.Cc] ?? '',
    city: address?.[AddressField.City] ?? '',
    postal_code: address?.[AddressField.PostalCode] ?? '',
    street: address?.[AddressField.Street] ?? '',

    include: 'shipment_options',
  };
};
