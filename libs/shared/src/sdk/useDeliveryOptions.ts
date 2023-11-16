import {useSdk} from '@myparcel-do/shared';
import {GetDeliveryOptions} from '@myparcel/sdk';
import {useQuery} from './useQuery';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useDeliveryOptions = (parameters: GetDeliveryOptions['parameters']) => {
  return useQuery([GetDeliveryOptions.name, parameters], () => {
    const sdk = useSdk();

    return sdk.getDeliveryOptions({parameters});
  });
};
