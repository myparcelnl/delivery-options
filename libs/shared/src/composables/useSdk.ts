import {ref, type Ref, readonly, type DeepReadonly} from 'vue';
import {useMemoize} from '@vueuse/core';
import {
  createPublicSdk,
  FetchClient,
  GetCarrier,
  GetCarriers,
  GetDeliveryOptions,
  GetPickupLocations,
  type ClientConfig,
  type MyParcelSdk,
} from '@myparcel/sdk';

type Endpoints = GetCarrier | GetCarriers | GetDeliveryOptions | GetPickupLocations;

interface UseSdk {
  sdk: DeepReadonly<Ref<MyParcelSdk<Endpoints>>>;
  initialize(config?: ClientConfig): void;
}

export const useSdk = useMemoize((): UseSdk => {
  const sdk = ref();

  const initialize = (config?: ClientConfig) => {
    sdk.value = createPublicSdk(
      new FetchClient({
        ...config,
        headers: {
          ...config?.headers,
          'X-User-Agent': `MyParcelDeliveryOptions/${__VERSION__}`,
        },
      }),
      [new GetCarrier(), new GetCarriers(), new GetDeliveryOptions(), new GetPickupLocations()],
    );
  };

  return {
    initialize,
    sdk: readonly(sdk),
  };
});
