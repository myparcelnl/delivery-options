import {CONFIG} from '../../data';
import { METHOD_SEARCH, fetchFromEndpoint } from '../../data/request/fetchFromEndpoint';
import { CarrierConfigurationFactory } from '../../data/carriers/carrierConfigurationFactory';
import { configBus } from '../../config/configBus';
import { getRequestParameters } from '../../data/request/getRequestParameters';

/**
 * Fetch delivery options.
 *
 * @param {MyParcel.CarrierName} carrier - Carrier name.
 * @param {MyParcel.Platform} platform - Platform name.
 *
 * @returns {Promise<DeliveryOption[]>}
 */
export function fetchDeliveryOptions(carrier = configBus.currentCarrier, platform = configBus.get(CONFIG.PLATFORM)) {
  const carrierAllowsPackageType = CarrierConfigurationFactory
    .create(carrier, platform)
    .hasFeature([
      CONFIG.ALLOW_PACKAGE_TYPE_MAILBOX,
      CONFIG.ALLOW_PACKAGE_TYPE_DIGITAL_STAMP,
    ]);

  const packageType = carrierAllowsPackageType
    ? {
      package_type: configBus.get(CONFIG.PACKAGE_TYPE),
    }
    : {};

  return fetchFromEndpoint(
    'delivery_options',
    {
      method: METHOD_SEARCH,
      params: {
        ...packageType,
        ...getRequestParameters(carrier),
      },
    },
  );
}
