import {type EndpointParameters, type EndpointResponse, type GetPickupLocations} from '@myparcel/sdk';
import {type RequestHandler} from '../types';
import {QUERY_KEY_PICKUP_LOCATIONS} from '../constants';
import {useSdk} from '../composables';
import {useRequest} from './useRequest';

export const usePickupLocations = (
  parameters: EndpointParameters<GetPickupLocations>,
): RequestHandler<EndpointResponse<GetPickupLocations>> => {
  return useRequest([QUERY_KEY_PICKUP_LOCATIONS, parameters], () => {
    const sdk = useSdk();

    return sdk.getPickupLocations({parameters});
  });
};
