import { AbstractCarrierConfiguration } from '@/data/carriers/abstractCarrierConfiguration';
import { configBus } from '../../config/configBus';
import { getCarrierRequestParameters } from '@/delivery-options/data/request/getCarrierRequestParameters';
import { getDefaultRequestParameters } from '@/delivery-options/data/request/getDefaultRequestParameters';
import { getOptionalRequestParameters } from '@/delivery-options/data/request/getOptionalRequestParameters';
import { getParametersByPlatform } from '@/delivery-options/data/request/requestData';

/**
 * Gather the parameters for the delivery options request.
 *
 * @see https://myparcelnl.github.io/api/#8
 *
 * @param {AbstractCarrierConfiguration} carrierConfiguration - Carrier name or id.
 *
 * @returns {Partial<MyParcelDeliveryOptions.DeliveryOptionsRequestParameters>}
 */
export const getRequestParameters = (carrierConfiguration) => {
  const parameters = getDefaultRequestParameters(configBus, carrierConfiguration);
  const optionalParameters = getOptionalRequestParameters(configBus);

  parameters.carrier = carrierConfiguration?.getName();

  // Get the settings that are set in the config and add those to the parameters.
  Object
    .keys(optionalParameters)
    .filter((value) => !!optionalParameters[value])
    .forEach((option) => {
      parameters[option] = optionalParameters[option];
    });

  return {
    ...parameters,
    ...getParametersByPlatform(),
    ...getCarrierRequestParameters(carrierConfiguration),
  };
};
