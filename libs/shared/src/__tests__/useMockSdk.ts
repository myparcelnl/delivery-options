import {ref, type Ref} from 'vue';
import {
  type ClientConfig,
  type AbstractPublicEndpoint,
  type Options,
  GetCarrier,
  GetCarriers,
  GetDeliveryOptions,
  GetPickupLocations,
  type EndpointResponse,
} from '@myparcel/sdk';
import {mockGetCarrier, mockGetCarriers, mockGetDeliveryOptions, mockGetPickupLocations} from './mocks';

export type LastOptions<E extends AbstractPublicEndpoint<any> = AbstractPublicEndpoint<any>> = Readonly<{
  endpoint: Readonly<E>;
  options: Readonly<Options<E>>;
}>;

const history = ref<LastOptions[]>([]);
const clientConfig = ref<ClientConfig>();

interface UseMockSdk {
  clientConfig: Ref<ClientConfig | undefined>;
  history: Ref<LastOptions[]>;

  doRequest<E extends AbstractPublicEndpoint<any>>(endpoint: E, options: Options<E>): Promise<EndpointResponse<E>>;

  reset(): void;
}

export const useMockSdk = (): UseMockSdk => {
  const doRequest = async <E extends AbstractPublicEndpoint<any>>(
    endpoint: E,
    options: Options<E>,
  ): Promise<EndpointResponse<E>> => {
    history.value.push({
      endpoint: Object.freeze(endpoint),
      options: Object.freeze(options),
    });

    if (endpoint instanceof GetCarrier) {
      return Promise.resolve(mockGetCarrier(endpoint, options));
    }

    if (endpoint instanceof GetCarriers) {
      return Promise.resolve(mockGetCarriers(endpoint, options));
    }

    if (endpoint instanceof GetDeliveryOptions) {
      return Promise.resolve(mockGetDeliveryOptions(endpoint, options));
    }

    if (endpoint instanceof GetPickupLocations) {
      return Promise.resolve(mockGetPickupLocations(endpoint, options));
    }

    throw new Error(`Unknown request: ${endpoint.name}`);
  };

  const reset = () => {
    history.value = [];
    clientConfig.value = undefined;
  };

  return {
    doRequest,
    reset,
    clientConfig,
    history,
  };
};
