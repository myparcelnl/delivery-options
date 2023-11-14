import {getParametersByPlatform} from './requestData';
import {getOptionalRequestParameters} from './getOptionalRequestParameters';
import {getDefaultRequestParameters} from './getDefaultRequestParameters';
import {getCarrierRequestParameters} from './getCarrierRequestParameters';

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
  Object.keys(optionalParameters)
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
