import {type EndpointParameters, type EndpointResponse, type GetDeliveryOptions} from '@myparcel/sdk';
import {type RequestHandler} from '../types';
import {QUERY_KEY_DELIVERY_OPTIONS} from '../constants';
import {useSdk} from '../composables';
import {useRequest} from './useRequest';

export const useDeliveryOptions = (
  parameters: EndpointParameters<GetDeliveryOptions>,
): RequestHandler<EndpointResponse<GetDeliveryOptions>> => {
  return useRequest([QUERY_KEY_DELIVERY_OPTIONS, parameters], async () => {
    const sdk = useSdk();

    try {
      return await sdk.getDeliveryOptions({parameters});
    } catch (e) {
      return [];
    }
  });
};
