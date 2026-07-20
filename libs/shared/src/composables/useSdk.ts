import {useMemoize} from '@vueuse/core';
import {
  createPublicSdk,
  FetchClient,
  GetCarrier,
  GetCarriers,
  GetDeliveryOptions,
  GetPickupLocations,
} from '@myparcel-dev/sdk';

let sdkBaseUrl: string | undefined;

/**
 * Override the base url for all SDK requests (delivery options, carriers,
 * pickup locations), e.g. to use an acceptance environment. This applies the
 * `apiBaseUrl` config option. Pass undefined to restore the SDK's default url.
 */
export const setSdkBaseUrl = (url?: string): void => {
  // An empty string also restores the default url.
  const newUrl = url?.length ? url : undefined;

  if (newUrl === sdkBaseUrl) {
    return;
  }

  sdkBaseUrl = newUrl;
  useSdk.clear();
};

export const useSdk = useMemoize(() => {
  return createPublicSdk(
    new FetchClient({
      ...(sdkBaseUrl ? {baseUrl: sdkBaseUrl} : {}),
      headers: {
        'X-User-Agent': `MyParcelDeliveryOptions/${__VERSION__}`,
      },
    }),
    [new GetCarrier(), new GetCarriers(), new GetDeliveryOptions(), new GetPickupLocations()],
  );
});
