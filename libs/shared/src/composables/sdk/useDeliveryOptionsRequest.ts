import type {PromiseOr} from '@myparcel-dev/ts-utils';
import {
  type EndpointParameters,
  type EndpointResponse,
  type GetDeliveryOptions,
  type ApiException,
} from '@myparcel-dev/sdk';
import {useSdk} from '../useSdk';
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
      onError(error: ApiException): PromiseOr<void> {
        throw error;
      },
    },
  );
};
