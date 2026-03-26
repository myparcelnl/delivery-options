import {computed, watch} from 'vue';
import {useMemoize} from '@vueuse/core';
import {mapPackageTypeToCapability, useReactiveCapabilities} from '@myparcel-dev/do-shared';
import {useSandboxStore} from '../stores';

export const useSandboxCapabilities = useMemoize(() => {
  const store = useSandboxStore();

  const proxyCapabilities = `${store.config.apiBaseUrl ?? 'https://api.myparcel.nl'}/shipments/capabilities`;

  const request = computed(() => {
    const capPackageType = store.config.packageType
      ? mapPackageTypeToCapability(store.config.packageType)
      : undefined;

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
