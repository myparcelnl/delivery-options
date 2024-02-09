import {type MaybeRef} from 'vue';
import {get} from '@vueuse/core';
import {getFullCarrier, computedAsync, type ComputedAsync} from '../utils';
import {type CarrierIdentifier, type FullCarrier, type SupportedPlatformName} from '../types';

export const useFullCarrier = (
  carrierIdentifier: MaybeRef<CarrierIdentifier>,
  platformName: MaybeRef<SupportedPlatformName>,
): ComputedAsync<FullCarrier> => {
  return computedAsync(() => getFullCarrier(get(carrierIdentifier), get(platformName)));
};
