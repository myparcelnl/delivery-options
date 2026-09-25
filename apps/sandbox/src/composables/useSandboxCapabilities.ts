import {computed, watch} from 'vue';
import {useMemoize} from '@vueuse/core';
import {mapPackageTypeToCapability, useReactiveCapabilities, validatePhysicalProperties} from '@myparcel-dev/do-shared';
import {useSandboxStore} from '../stores';
import {getProxyCapabilitiesUrl} from '../constants';

export const useSandboxCapabilities = useMemoize(() => {
  const store = useSandboxStore();

  // Pass a getter so the url follows the apiBaseUrl override reactively;
  // a plain value would be snapshotted before the user can change it.
  const proxyCapabilities = (): string => getProxyCapabilitiesUrl(store.config.apiBaseUrl);

  const request = computed(() => {
    const capPackageType = store.config.packageType ? mapPackageTypeToCapability(store.config.packageType) : undefined;

    const {physicalProperties} = store.config;

    return {
      ...(physicalProperties && validatePhysicalProperties().validate(physicalProperties)
        ? {physicalProperties: {weight: {value: physicalProperties.weight, unit: 'g'}}}
        : {}),
      recipient: {
        countryCode: store.address.cc,
        // Mirrors the widget: forward the flag when it is set, omit it entirely when it is not, so
        // the carriers listed here match the ones the widget ends up rendering.
        ...(store.config.isBusiness === undefined ? {} : {isBusiness: store.config.isBusiness}),
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
