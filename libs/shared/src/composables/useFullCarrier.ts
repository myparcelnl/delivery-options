import {type MaybeRef, type Ref} from 'vue';
import {asyncComputed, get} from '@vueuse/core';
import {getFullCarrier} from '../utils';
import {type CarrierIdentifier, type FullCarrier, type SupportedPlatformName} from '../types';

export const useFullCarrier = (
  carrierIdentifier: MaybeRef<CarrierIdentifier>,
  platformName: MaybeRef<SupportedPlatformName>,
): Ref<FullCarrier> => {
  return asyncComputed(() => getFullCarrier(get(carrierIdentifier), get(platformName)));
};
