import * as CONFIG from '@/data/keys/configKeys';
import { configBus as realConfigBus } from '@/delivery-options/config/configBus';
import snakeCase from 'lodash-es/snakeCase';

/**
 * Get the default parameters for all API requests.
 *
 * @param {import('@/delivery-options/config/configBus')} configBus - Optional parameter for easier testing.
 *
 * @param carrierConfiguration
 * @returns {Partial<MyParcelDeliveryOptions.DeliveryOptionsRequestParameters>}
 */
// eslint-disable-next-line default-param-last
export const getDefaultRequestParameters = (configBus = realConfigBus, carrierConfiguration) => {
  const parameters = {
    /**
     * The endpoints we use in this application follow the JSON API "Inclusion of Related Resources" standard.
     *
     * @see https://jsonapi.org/format/#fetching-includes
     */
    include: 'shipment_options',

    platform: configBus.get(CONFIG.PLATFORM),
    carrier: carrierConfiguration.getName(),

    cc: configBus.address.cc,
  };

  return carrierConfiguration.getDefaultRequestParameters().reduce((acc, key) => {
    const value = configBus.address[key];

    if (value) {
      acc[snakeCase(key)] = value;
    }

    return acc;
  }, { ...parameters });
};
