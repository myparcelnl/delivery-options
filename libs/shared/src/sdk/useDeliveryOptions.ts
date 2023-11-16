import {type Query} from '@myparcel-do/shared';
import {type EndpointParameters, type EndpointResponse, GetDeliveryOptions} from '@myparcel/sdk';
import {useSdk} from '../composables';
import {useQuery} from './useQuery';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useDeliveryOptions = (
  parameters: EndpointParameters<GetDeliveryOptions>,
): Query<EndpointResponse<GetDeliveryOptions>> => {
  return useQuery([GetDeliveryOptions.name, parameters], () => {
    const sdk = useSdk();

    return sdk.getDeliveryOptions({parameters});
  });
};
