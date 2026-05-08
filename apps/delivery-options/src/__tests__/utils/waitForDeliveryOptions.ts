import {flushPromises} from '@vue/test-utils';
import {waitFor} from '@testing-library/vue';
import {type DeliveryOption} from '@myparcel-dev/sdk';
import {waitForRequestData, useDeliveryOptionsRequest, useCarriersRequest} from '@myparcel-dev/do-shared';
import {CarrierName} from '@myparcel-dev/constants';
import {getResolvedCarrier, createGetDeliveryOptionsParameters} from '../../utils';
import {useResolvedDeliveryOptions} from '../../composables';

export const waitForDeliveryOptions = async (carrier?: CarrierName): Promise<DeliveryOption[]> => {
  const carrierName = carrier ?? CarrierName.PostNl;
  const options = useResolvedDeliveryOptions();

  const resolvedCarrier = getResolvedCarrier(carrierName);

  await flushPromises();

  const [data] = await Promise.all([
    waitForRequestData(useDeliveryOptionsRequest, [createGetDeliveryOptionsParameters(resolvedCarrier)]),
    useCarriersRequest().load(),
    waitFor(() => !options.loading.value, {timeout: 1000}),
    options.load(),
  ]);

  await flushPromises();

  return data;
};
