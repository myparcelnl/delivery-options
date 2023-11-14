import {useMemoize} from '@vueuse/core';
import {
  createPublicSdk,
  FetchClient,
  GetCarrier,
  GetCarriers,
  GetDeliveryOptions,
  GetPickupLocations,
} from '@myparcel/sdk';

export const useSdk = useMemoize(() => {
  return createPublicSdk(
    new FetchClient({
      headers: {
        'X-User-Agent': 'MyParcelDeliveryOptions/1.0.0',
      },
    }),
    [new GetCarrier(), new GetCarriers(), new GetDeliveryOptions(), new GetPickupLocations()],
  );
});
