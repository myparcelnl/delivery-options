import {type EndpointParameters, type EndpointResponse, type GetDeliveryOptions} from '@myparcel/sdk';
import {useSdk} from '../useSdk';
import {type RequestHandler} from '../../types';
import {REQUEST_KEY_DELIVERY_OPTIONS} from '../../data';
import {useRequest} from './useRequest';

export const useDeliveryOptionsRequest = (
  parameters: EndpointParameters<GetDeliveryOptions>,
): RequestHandler<EndpointResponse<GetDeliveryOptions>> => {
  return useRequest([REQUEST_KEY_DELIVERY_OPTIONS, parameters], async () => {
    const sdk = useSdk();

    try {
      return await sdk.getDeliveryOptions({parameters});
    } catch (e) {
      return [];
    }
  });
};
