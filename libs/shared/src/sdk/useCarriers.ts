import {type EndpointResponse, type GetCarriers} from '@myparcel/sdk';
import {type RequestHandler} from '../types';
import {QUERY_KEY_CARRIERS} from '../constants';
import {useSdk} from '../composables';
import {useRequestClient} from './useRequestClient';
import {useRequest} from './useRequest';

export const useCarriers = (): RequestHandler<EndpointResponse<GetCarriers>> => {
  return useRequest(
    [QUERY_KEY_CARRIERS],
    async () => {
      const sdk = useSdk();

      return sdk.getCarriers();
    },
    {
      onSuccess(carriers) {
        const client = useRequestClient();

        /**
         * Update the cache for each carrier.
         */
        carriers.forEach((carrier) => {
          client.values.set([QUERY_KEY_CARRIERS, carrier.name], carrier);
        });
      },
    },
  );
};
