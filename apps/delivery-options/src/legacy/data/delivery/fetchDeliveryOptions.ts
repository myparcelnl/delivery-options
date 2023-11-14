import {ACCEPT_JSON, endpointDeliveryOptions, HEADER_ACCEPT} from '../endpoints';

/**
 * Fetch delivery options.
 *
 * @param {MyParcel.CarrierIdentifier} carrier - Carrier name.
 * @param {MyParcel.Platform} platform - Platform name.
 *
 * @returns {Promise<MyParcelDeliveryOptions.DeliveryOption[]>}
 */
export function fetchDeliveryOptions(carrier = configBus.currentCarrier, platform = configBus.get(CONFIG.PLATFORM)) {
  const carrierConfiguration = getCarrierConfiguration(carrier, platform);

  const countriesForDelivery = carrierConfiguration.getCountriesForDelivery();
  const hasFakeDelivery = carrierConfiguration.hasFakeDelivery();

  // Return an empty array if the carrier doesn't deliver to the current country and fake delivery is enabled.
  if (hasFakeDelivery && !countriesForDelivery.includes(configBus.address.cc)) {
    return Promise.resolve([]);
  }

  const carrierAllowsPackageType = carrierConfiguration.hasFeature([
    CONFIG.ALLOW_PACKAGE_TYPE_MAILBOX,
    CONFIG.ALLOW_PACKAGE_TYPE_DIGITAL_STAMP,
  ]);

  return fetchFromEndpoint(endpointDeliveryOptions, {
    headers: {
      [HEADER_ACCEPT]: `${ACCEPT_JSON};version=2.0`,
    },
    params: {
      ...(carrierAllowsPackageType ? {package_type: configBus.get(CONFIG.PACKAGE_TYPE)} : {}),
      ...getRequestParameters(carrierConfiguration),
    },
  });
}
