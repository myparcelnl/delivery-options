import {type MaybeRef, type Ref} from 'vue';
import {asyncComputed, get, useMemoize} from '@vueuse/core';
import {getFullCarrier} from '../utils';
import {type CarrierIdentifier, type FullCarrier, type SupportedPlatformName} from '../types';
import {resolveRefKey} from '../resolveRefKey';

const cb = (
  carrierIdentifier: MaybeRef<CarrierIdentifier>,
  platformName: MaybeRef<SupportedPlatformName>,
): Ref<FullCarrier> => {
  return asyncComputed(() => getFullCarrier(get(carrierIdentifier), get(platformName)));
};

export const useFullCarrier = useMemoize(cb, {getKey: resolveRefKey});
