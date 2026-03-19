import {computed, type ComputedRef} from 'vue';
import {type CapabilitiesRequest, mapPackageTypeToCapability} from '@myparcel-dev/do-shared';
import {useAddressStore, useConfigStore} from '../stores';

/**
 * Build reactive capabilities request params from store state.
 * Does NOT include user selections (carrier/deliveryType/options).
 */
export const useBroadCapabilitiesParams = (): ComputedRef<CapabilitiesRequest> => {
  const {state: config} = useConfigStore();
  const {state: address} = useAddressStore();

  return computed(() => {
    const request: CapabilitiesRequest = {
      recipient: {
        countryCode: address.cc,
        ...(address.postalCode ? {postalCode: address.postalCode} : {}),
      },
    };

    const capPackageType = mapPackageTypeToCapability(config.packageType);

    if (capPackageType) {
      request.packageType = capPackageType;
    }

    return request;
  });
};
