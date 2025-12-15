import {toValue} from 'vue';
import {get, shake} from 'radash';
import {
  AddressField,
  CarrierSetting,
  DELIVERY_DAYS_WINDOW_DEFAULT,
  DROP_OFF_DELAY_DEFAULT,
  resolveCarrierName,
} from '@myparcel-dev/shared';
import {type EndpointParameters, type GetDeliveryOptions} from '@myparcel/sdk';
import {PlatformName} from '@myparcel/constants';
import {useAddressStore, useConfigStore} from '../stores';
import {type UseResolvedCarrier} from '../composables';
import {calculatePackageType} from './calculatePackageType';
import {calculateDropOffDays} from './calculateDropOffDays';
import {calculateCutoffTime} from './calculateCutoffTime';

export const createGetDeliveryOptionsParameters = (
  resolvedCarrier: UseResolvedCarrier,
  additionalParameters?: undefined | Partial<EndpointParameters<GetDeliveryOptions>>,
): EndpointParameters<GetDeliveryOptions> => {
  const {state: config} = useConfigStore();
  const {state: address} = useAddressStore();

  const {carrier} = resolvedCarrier;

  const resolvedPackageType = calculatePackageType(resolvedCarrier);

  const parameters = shake({
    platform: config.platform ?? PlatformName.MyParcel,
    carrier: resolveCarrierName(carrier.value.identifier),
    package_type: resolvedPackageType,

    cutoff_time: calculateCutoffTime(resolvedCarrier),
    deliverydays_window: resolvedCarrier.get(CarrierSetting.DeliveryDaysWindow, DELIVERY_DAYS_WINDOW_DEFAULT),
    dropoff_days: calculateDropOffDays(resolvedCarrier),
    dropoff_delay: resolvedCarrier.get(CarrierSetting.DropOffDelay, DROP_OFF_DELAY_DEFAULT),

    same_day_delivery: toValue(resolvedCarrier.features).has(CarrierSetting.AllowSameDayDelivery) || undefined,
    monday_delivery: toValue(resolvedCarrier.features).has(CarrierSetting.AllowMondayDelivery) || undefined,
    saturday_delivery: toValue(resolvedCarrier.features).has(CarrierSetting.AllowSaturdayDelivery) || undefined,

    cc: get(address, AddressField.Country, ''),
    city: get(address, AddressField.City, ''),
    postal_code: get(address, AddressField.PostalCode, ''),
    street: get(address, AddressField.Street, ''),

    include: 'shipment_options',

    exclude_parcel_lockers: config.excludeParcelLockers ? true : undefined,

    ...additionalParameters,
  } satisfies EndpointParameters<GetDeliveryOptions>);

  return Object.fromEntries(
    Object.entries(parameters).filter(([key]) => {
      const config = toValue(resolvedCarrier.config);

      return !config?.unsupportedParameters?.includes(key);
    }),
  ) as EndpointParameters<GetDeliveryOptions>;
};
