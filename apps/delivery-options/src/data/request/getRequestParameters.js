import { configBus } from '../../config/configBus';
import { getDefaultRequestParameters } from '../../data/request/getDefaultRequestParameters';
import { getOptionalRequestParameters } from '../../data/request/getOptionalRequestParameters';
import { getParametersByPlatform } from '../../data/request/requestData';
import { getCarrierRequestParameters } from '../../data/request/getCarrierRequestParameters';

/**
 * Gather the parameters for the delivery options request.
 *
 * @see https://myparcelnl.github.io/api/#8
 *
 * @param {MyParcel.CarrierName} carrier - Carrier name or id.
 *
 * @returns {Partial<MyParcelDeliveryOptions.DeliveryOptionsRequestParameters>}
 */
export const getRequestParameters = (carrier = configBus.currentCarrier) => {
  const parameters = getDefaultRequestParameters();
  const optionalParameters = getOptionalRequestParameters();

  parameters.carrier = carrier;

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
    ...getCarrierRequestParameters(carrier),
  };
};
