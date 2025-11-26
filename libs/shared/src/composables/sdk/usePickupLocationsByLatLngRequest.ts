import {type EndpointParameters, type GetPickupLocations, type PickupLocation} from '@myparcel-dev/sdk';
import {useSdk} from '../useSdk';
import {type RequestHandler} from '../../types';
import {REQUEST_KEY_PICKUP_LOCATIONS} from '../../data';
import {useRequest} from './useRequest';

export const usePickupLocationsByLatLngRequest = (
  parameters: EndpointParameters<GetPickupLocations>,
): RequestHandler<PickupLocation[]> => {
  return useRequest(
    [REQUEST_KEY_PICKUP_LOCATIONS, parameters],
    () => {
      const sdk = useSdk();

      return sdk.getPickupLocations({parameters});
    },
    {
      fallback: [],

      /**
       * TODO: Remove this when the api returns a proper response rather than 500 internal server error when no pickup
       *  locations are found (API-1301)
       */
      onError() {
        // silently fail
      },
    },
  );
};
