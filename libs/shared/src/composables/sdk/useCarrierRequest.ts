import {type MaybeRef} from 'vue';
import {get} from '@vueuse/core';
import {type EndpointResponse, type GetCarrier} from '@myparcel/sdk';
import {type CarrierName} from '@myparcel/constants';
import {type RequestHandler} from '../../types';
import {REQUEST_KEY_CARRIERS} from '../../data';
import {useSdk} from '..';
import {useRequest} from './useRequest';

export const useCarrierRequest = (
  carrier: MaybeRef<CarrierName>,
): RequestHandler<EndpointResponse<GetCarrier>[number]> => {
  return useRequest([REQUEST_KEY_CARRIERS, get(carrier)], async () => {
    const sdk = useSdk();

    return (await sdk.getCarrier({path: {carrier: get(carrier)}}))?.[0];
  });
};
