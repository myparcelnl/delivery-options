import type {PromiseOr} from '@myparcel/ts-utils';
import {
  type EndpointParameters,
  type EndpointResponse,
  type GetDeliveryOptions,
  type ApiException,
} from '@myparcel/sdk';
import {useSdk} from '../useSdk';
import {useApiExceptions} from '../useApiExceptions';
import {type RequestHandler, type RequestKey} from '../../types';
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
      onError(error: ApiException, requestKey: RequestKey): PromiseOr<void> {
        const {addException} = useApiExceptions();
        addException(requestKey, error);
        throw error;
      },
    },
  );
};
