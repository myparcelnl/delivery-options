import {computed, watch} from 'vue';
import {useMemoize} from '@vueuse/core';
import {mapPackageTypeToCapability, useReactiveCapabilities} from '@myparcel-dev/do-shared';
import {useSandboxStore} from '../stores';
import {getProxyCapabilitiesUrl} from '../constants';

export const useSandboxCapabilities = useMemoize(() => {
  const store = useSandboxStore();

  // Pass a getter so the url follows the apiBaseUrl override reactively;
  // a plain value would be snapshotted before the user can change it.
  const proxyCapabilities = (): string => getProxyCapabilitiesUrl(store.config.apiBaseUrl);

  const request = computed(() => {
    const capPackageType = store.config.packageType ? mapPackageTypeToCapability(store.config.packageType) : undefined;

    return {
      recipient: {
        countryCode: store.address.cc,
      },
      ...(capPackageType ? {packageType: capPackageType} : {}),
    };
  });

  const apiKey = computed(() => store.config.apiKey || undefined);

  const caps = useReactiveCapabilities(proxyCapabilities, request, apiKey);

  watch(caps.availableCarrierNames, (names) => {
    if (apiKey.value && names.length) {
      store.syncCarriersFromCapabilities(names);
    }
  });

  return caps;
});
