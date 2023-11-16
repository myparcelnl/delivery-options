// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
import {type EndpointParameters, GetPickupLocations} from '@myparcel/sdk';
import {useSdk} from '../composables';
import {useQuery} from './useQuery';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const usePickupLocations = (parameters: EndpointParameters<GetPickupLocations>) => {
  return useQuery([GetPickupLocations.name, parameters], () => {
    const sdk = useSdk();

    return sdk.getPickupLocations({parameters});
  });
};
