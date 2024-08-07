import {type MaybeRef, toValue} from 'vue';
import {type EndpointResponse, type GetCarrier} from '@myparcel/sdk';
import {type CarrierName} from '@myparcel/constants';
import {useSdk} from '../useSdk';
import {type RequestHandler} from '../../types';
import {REQUEST_KEY_CARRIERS} from '../../data';
import {useRequest} from './useRequest';

export const useCarrierRequest = (
  carrier: MaybeRef<CarrierName>,
): RequestHandler<EndpointResponse<GetCarrier>[number]> => {
  return useRequest([REQUEST_KEY_CARRIERS, toValue(carrier)], async () => {
    const sdk = useSdk();

    const carriers = await sdk.getCarrier({path: {carrier: toValue(carrier)}});

    return carriers?.[0];
  });
};
