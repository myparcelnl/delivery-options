import {type MaybeRef, computed, toValue} from 'vue';
import {type CarrierName} from '@myparcel/constants';
import {type EndpointResponse, type GetCarrier} from '@myparcel/sdk';
import {useCarriersRequest} from './useCarriersRequest';
import {type RequestHandler} from '../../types';

export const useCarrierFromCache = (
  carrier: MaybeRef<CarrierName>,
): RequestHandler<EndpointResponse<GetCarrier>[number] | undefined> => {
  const carriersRequest = useCarriersRequest();
  
  const data = computed(() => {
    const carrierName = toValue(carrier);
    if (!carrierName || !carriersRequest.data.value) return undefined;
    
    return carriersRequest.data.value.find(c => c.name === carrierName);
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
