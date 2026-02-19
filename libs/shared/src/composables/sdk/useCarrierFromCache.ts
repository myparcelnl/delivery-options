import {type MaybeRef, computed, toValue} from 'vue';
import {type EndpointResponse, type GetCarrier} from '@myparcel-dev/sdk';
import {type CarrierName} from '@myparcel-dev/constants';
import {type RequestHandler} from '../../types';
import {useCarriersRequest} from './useCarriersRequest';

export const useCarrierFromCache = (
  carrier: MaybeRef<CarrierName>,
): RequestHandler<EndpointResponse<GetCarrier>[number] | undefined> => {
  const carriersRequest = useCarriersRequest();

  const data = computed(() => {
    const carrierName = toValue(carrier);

    if (!carrierName || !carriersRequest.data.value) {
      return undefined;
    }

    return carriersRequest.data.value.find((cr) => cr.name === carrierName);
  });

  const loading = computed(() => carriersRequest.loading.value);

  const load = async () => {
    await carriersRequest.load();
  };

  return {
    data,
    loading,
    load,
  };
};
