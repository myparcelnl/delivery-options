import {toValue} from 'vue';
import {get, shake} from 'radash';
import {
  AddressField,
  CarrierSetting,
  DELIVERY_DAYS_WINDOW_DEFAULT,
  DROP_OFF_DELAY_DEFAULT,
  type SupportedPackageTypeName,
  resolveCarrierName,
  PACKAGE_TYPE_DEFAULT,
} from '@myparcel-do/shared';
import {type EndpointParameters, type GetDeliveryOptions} from '@myparcel/sdk';
import {PackageTypeName, PlatformName} from '@myparcel/constants';
import {useAddressStore, useConfigStore} from '../stores';
import {type UseResolvedCarrier} from '../composables';
import {getResolvedValue} from './getResolvedValue';
import {calculateDropOffDays} from './calculateDropOffDays';
import {calculateCutoffTime} from './calculateCutoffTime';

export const createGetDeliveryOptionsParameters = (
  resolvedCarrier: UseResolvedCarrier,
): EndpointParameters<GetDeliveryOptions> => {
  const config = useConfigStore();
  const address = useAddressStore();

  const {carrier} = resolvedCarrier;

  const packageType: SupportedPackageTypeName = getResolvedValue(
    CarrierSetting.PackageType,
    carrier.value.identifier,
    PackageTypeName.Package,
  );

  const parameters = shake({
    platform: config.platform ?? PlatformName.MyParcel,
    carrier: resolveCarrierName(carrier.value.identifier),
    package_type: resolvedCarrier.packageTypes.value.has(packageType) ? packageType : PACKAGE_TYPE_DEFAULT,

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
  } satisfies EndpointParameters<GetDeliveryOptions>);

  return Object.fromEntries(
    Object.entries(parameters).filter(([key]) => {
      return !resolvedCarrier.config.value?.unsupportedParameters?.includes(key);
    }),
  ) as EndpointParameters<GetDeliveryOptions>;
};
