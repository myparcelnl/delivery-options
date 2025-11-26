import {useMemoize} from '@vueuse/core';
import {
  createPublicSdk,
  FetchClient,
  GetCarrier,
  GetCarriers,
  GetDeliveryOptions,
  GetPickupLocations,
} from '@myparcel-dev/sdk';

export const useSdk = useMemoize(() => {
  return createPublicSdk(
    new FetchClient({
      headers: {
        'X-User-Agent': `MyParcelDeliveryOptions/${__VERSION__}`,
      },
    }),
    [new GetCarrier(), new GetCarriers(), new GetDeliveryOptions(), new GetPickupLocations()],
  );
});
