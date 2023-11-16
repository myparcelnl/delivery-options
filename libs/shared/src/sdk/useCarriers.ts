import {GetCarriers} from '@myparcel/sdk';
import {useSdk} from '../composables';
import {useQuery} from './useQuery';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useCarriers = () => {
  return useQuery([GetCarriers.name], async () => {
    const sdk = useSdk();

    return sdk.getCarriers();
  });
};
