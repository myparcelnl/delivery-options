import {type EndpointResponse, type GetCarriers} from '@myparcel/sdk';
import {type RequestHandler} from '../../types';
import {REQUEST_KEY_CARRIERS} from '../../data';
import {useSdk} from '..';
import {useRequestStorage} from './useRequestStorage';
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
        const requestStorage = useRequestStorage();

        /**
         * Update the cache for each carrier.
         */
        carriers.forEach((carrier) => {
          requestStorage.set([REQUEST_KEY_CARRIERS, carrier.name], carrier);
        });
      },
    },
  );
};
