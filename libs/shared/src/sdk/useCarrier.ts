import {GetCarrier} from '@myparcel/sdk';
import {type CarrierName} from '@myparcel/constants';
import {useSdk} from '../composables';
import {useQuery} from './useQuery';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useCarrier = (carrier: CarrierName) => {
  return useQuery([GetCarrier.name, carrier], async () => {
    const sdk = useSdk();

    return (await sdk.getCarrier({path: {carrier}}))?.[0];
  });
};
