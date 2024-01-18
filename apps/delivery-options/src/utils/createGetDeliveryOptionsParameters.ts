import {get} from '@vueuse/core';
import {
  AddressField,
  CarrierSetting,
  DELIVERY_DAYS_WINDOW_DEFAULT,
  DROP_OFF_DELAY_DEFAULT,
  type SupportedPackageTypeName,
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

  return {
    platform: config.platform ?? PlatformName.MyParcel,
    carrier: carrier.name,
    package_type: carrier.allowedPackageTypes.value.has(packageType) ? packageType : PackageTypeName.Package,

    cutoff_time: calculateCutoffTime(carrier),
    deliverydays_window: carrier.get(CarrierSetting.DeliveryDaysWindow, DELIVERY_DAYS_WINDOW_DEFAULT),
    dropoff_days: calculateDropOffDays(carrier),
    dropoff_delay: carrier.get(CarrierSetting.DropOffDelay, DROP_OFF_DELAY_DEFAULT),

    monday_delivery: get(carrier.features).has(CarrierSetting.AllowMondayDelivery),
    saturday_delivery: get(carrier.features).has(CarrierSetting.AllowSaturdayDelivery),

    cc: address?.[AddressField.Country] ?? '',
    city: address?.[AddressField.City] ?? '',
    postal_code: address?.[AddressField.PostalCode] ?? '',
    street: address?.[AddressField.Street] ?? '',

    include: 'shipment_options',
  };
};
