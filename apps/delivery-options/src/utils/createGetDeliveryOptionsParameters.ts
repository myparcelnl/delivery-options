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
import {type ResolvedCarrier} from '../types';
import {useAddressStore, useConfigStore} from '../stores';
import {getResolvedValue} from './getResolvedValue';
import {calculateDropOffDays} from './calculateDropOffDays';
import {calculateCutoffTime} from './calculateCutoffTime';

export const createGetDeliveryOptionsParameters = (
  carrier: ResolvedCarrier,
): EndpointParameters<GetDeliveryOptions> => {
  const config = useConfigStore();
  const address = useAddressStore();

  const packageType: SupportedPackageTypeName = getResolvedValue(
    CarrierSetting.PackageType,
    carrier.identifier,
    PackageTypeName.Package,
  );

  const parameters = shake({
    platform: config.platform ?? PlatformName.MyParcel,
    carrier: resolveCarrierName(carrier.identifier),
    package_type: carrier.packageTypes.value.has(packageType) ? packageType : PACKAGE_TYPE_DEFAULT,

    cutoff_time: calculateCutoffTime(carrier),
    deliverydays_window: carrier.get(CarrierSetting.DeliveryDaysWindow, DELIVERY_DAYS_WINDOW_DEFAULT),
    dropoff_days: calculateDropOffDays(carrier),
    dropoff_delay: carrier.get(CarrierSetting.DropOffDelay, DROP_OFF_DELAY_DEFAULT),

    same_day_delivery: toValue(carrier.features).has(CarrierSetting.AllowSameDayDelivery) || undefined,
    monday_delivery: toValue(carrier.features).has(CarrierSetting.AllowMondayDelivery) || undefined,
    saturday_delivery: toValue(carrier.features).has(CarrierSetting.AllowSaturdayDelivery) || undefined,

    cc: get(address, AddressField.Country, ''),
    city: get(address, AddressField.City, ''),
    postal_code: get(address, AddressField.PostalCode, ''),
    street: get(address, AddressField.Street, ''),

    include: 'shipment_options',
  } satisfies EndpointParameters<GetDeliveryOptions>);

  return Object.fromEntries(
    Object.entries(parameters).filter(([key]) => {
      return !carrier.config.value?.unsupportedParameters?.includes(key);
    }),
  ) as EndpointParameters<GetDeliveryOptions>;
};
