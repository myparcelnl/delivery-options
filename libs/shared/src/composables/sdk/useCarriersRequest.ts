import {type EndpointResponse, type GetCarriers} from '@myparcel/sdk';
import {type RequestHandler} from '../../types';
import {REQUEST_KEY_CARRIERS} from '../../data';
import {useSdk} from '..';
import {useRequestClient} from './useRequestClient';
import {useRequest} from './useRequest';

export const useCarriersRequest = (): RequestHandler<EndpointResponse<GetCarriers>> => {
  return useRequest(
    [REQUEST_KEY_CARRIERS],
    async () => {
      const sdk = useSdk();

      return sdk.getCarriers();
    },
    {
      onSuccess(carriers) {
        const requestClient = useRequestClient();

        /**
         * Update the cache for each carrier.
         */
        carriers.forEach((carrier) => {
          requestClient.values.set([REQUEST_KEY_CARRIERS, carrier.name], carrier);
        });
      },
    },
  );
};
