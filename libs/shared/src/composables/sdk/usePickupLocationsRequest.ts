import {type EndpointParameters, type EndpointResponse, type GetPickupLocations} from '@myparcel/sdk';
import {type RequestHandler} from '../../types';
import {REQUEST_KEY_PICKUP_LOCATIONS} from '../../data';
import {useSdk} from '..';
import {useRequest} from './useRequest';

export const usePickupLocationsRequest = (
  parameters: EndpointParameters<GetPickupLocations>,
): RequestHandler<EndpointResponse<GetPickupLocations>> => {
  return useRequest([REQUEST_KEY_PICKUP_LOCATIONS, parameters], () => {
    const sdk = useSdk();

    return sdk.getPickupLocations({parameters});
  });
};