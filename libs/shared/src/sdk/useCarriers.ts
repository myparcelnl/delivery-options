import {GetCarrier, GetCarriers} from '@myparcel/sdk';
import {useSdk} from '../composables';
import {useQueryClient} from './useQueryClient';
import {useQuery} from './useQuery';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useCarriers = () => {
  return useQuery(
    [GetCarriers.name],
    async () => {
      const sdk = useSdk();

      return sdk.getCarriers();
    },
    {
      onSuccess(carriers) {
        const client = useQueryClient();

        /**
         * Update the cache for each carrier.
         */
        carriers.forEach((carrier) => {
          client.set([GetCarrier.name, carrier.name], carrier);
        });
      },
    },
  );
};
