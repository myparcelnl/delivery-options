import {type Ref} from 'vue';
import {asyncComputed, useMemoize} from '@vueuse/core';
import {type CarrierIdentifier} from '@myparcel-do/shared';
import {getResolvedCarrier} from '../utils';
import {type ResolvedCarrier} from '../types';
import {useConfigStore} from '../stores';
import {useCurrentPlatform} from './useCurrentPlatform';

/**
 * Get the carriers that are currently active in the delivery options config.
 */
export const useActiveCarriers = useMemoize((): Ref<ResolvedCarrier[]> => {
  const config = useConfigStore();
  const platform = useCurrentPlatform();

  return asyncComputed(async () => {
    return Promise.all(
      Object.keys(config.carrierSettings).map((identifier) => {
        return getResolvedCarrier(identifier as CarrierIdentifier, platform.name.value);
      }),
    );
  });
});
