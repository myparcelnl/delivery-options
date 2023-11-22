import {type EndpointResponse, type GetCarrier} from '@myparcel/sdk';
import {resolveCarrierName} from '../utils';
import {type CarrierIdentifier, type RequestHandler} from '../types';
import {QUERY_KEY_CARRIERS} from '../constants';
import {useSdk} from '../composables';
import {useRequest} from './useRequest';

export const useCarrier = (carrier: CarrierIdentifier): RequestHandler<EndpointResponse<GetCarrier>[number]> => {
  const carrierName = resolveCarrierName(carrier);

  return useRequest([QUERY_KEY_CARRIERS, carrierName], async () => {
    const sdk = useSdk();

    return (await sdk.getCarrier({path: {carrier: carrierName}}))?.[0];
  });
};
