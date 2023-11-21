import {GetCarrier} from '@myparcel/sdk';
import {resolveCarrierName} from '../utils';
import {type CarrierIdentifier} from '../types';
import {useSdk} from '../composables';
import {useQuery} from './useQuery';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useCarrier = (carrier: CarrierIdentifier) => {
  const carrierName = resolveCarrierName(carrier);

  return useQuery([GetCarrier.name, carrierName], async () => {
    const sdk = useSdk();

    return (await sdk.getCarrier({path: {carrier: carrierName}}))?.[0];
  });
};
