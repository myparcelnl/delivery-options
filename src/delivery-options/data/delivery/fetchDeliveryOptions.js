import * as CONFIG from '@/data/keys/configKeys';
import { METHOD_SEARCH, fetchFromEndpoint } from '@/delivery-options/data/request/fetchFromEndpoint';
import { CarrierConfigurationFactory } from '@/data/carriers/carrierConfigurationFactory';
import { configBus } from '@/delivery-options/config/configBus';
import { getRequestParameters } from '@/delivery-options/data/request/getRequestParameters';

/**
 * Fetch delivery options.
 *
 * @param {MyParcel.CarrierIdentifier} carrier - Carrier name.
 * @param {MyParcel.Platform} platform - Platform name.
 *
 * @returns {Promise<MyParcelDeliveryOptions.DeliveryOption[]>}
 */
export function fetchDeliveryOptions(carrier = configBus.currentCarrier, platform = configBus.get(CONFIG.PLATFORM)) {
  const carrierConfiguration = CarrierConfigurationFactory
    .create(carrier, platform);

  const countriesForDelivery = carrierConfiguration.getCountriesForDelivery();
  const hasFakeDelivery = carrierConfiguration.hasFakeDelivery();

  // Return an empty array if the carrier doesn't deliver to the current country and fake delivery is enabled.
  if (hasFakeDelivery && !countriesForDelivery.includes(configBus.address.cc)) {
    return Promise.resolve([]);
  }

  const carrierAllowsPackageType = carrierConfiguration
    .hasFeature([
      CONFIG.ALLOW_PACKAGE_TYPE_MAILBOX,
      CONFIG.ALLOW_PACKAGE_TYPE_DIGITAL_STAMP,
    ]);

  return fetchFromEndpoint(
    'delivery_options',
    {
      method: METHOD_SEARCH,
      params: {
        ...carrierAllowsPackageType ? { package_type: configBus.get(CONFIG.PACKAGE_TYPE) } : {},
        ...getRequestParameters(carrierConfiguration),
      },
    },
  );
}
