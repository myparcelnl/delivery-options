import {type EndpointParameters, type EndpointResponse, type GetDeliveryOptions} from '@myparcel-dev/sdk';
import {useSdk} from '../useSdk';
import {useLogger} from '../useLogger';
import {type RequestHandler} from '../../types';
import {REQUEST_KEY_DELIVERY_OPTIONS} from '../../data';
import {useRequest} from './useRequest';

export const useDeliveryOptionsRequest = (
  parameters: EndpointParameters<GetDeliveryOptions>,
): RequestHandler<EndpointResponse<GetDeliveryOptions>> => {
  return useRequest(
    [REQUEST_KEY_DELIVERY_OPTIONS, parameters],
    () => {
      const sdk = useSdk();

      return sdk.getDeliveryOptions({parameters});
    },
    {
      fallback: [],
      onError(error): void {
        useLogger().debug(`Skip delivery moments for ${parameters.carrier}.`, error);
      },
    },
  );
};
