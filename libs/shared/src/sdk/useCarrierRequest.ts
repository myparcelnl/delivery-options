import {type EndpointResponse, type GetCarrier} from '@myparcel/sdk';
import {resolveCarrierName} from '../utils';
import {type CarrierIdentifier, type RequestHandler} from '../types';
import {REQUEST_KEY_CARRIERS} from '../data/constants';
import {useSdk} from '../composables';
import {useRequest} from './useRequest';

export const useCarrierRequest = (carrier: CarrierIdentifier): RequestHandler<EndpointResponse<GetCarrier>[number]> => {
  const carrierName = resolveCarrierName(carrier);

  return useRequest([REQUEST_KEY_CARRIERS, carrierName], async () => {
    const sdk = useSdk();

    return (await sdk.getCarrier({path: {carrier: carrierName}}))?.[0];
  });
};
