import {type Ref} from 'vue';
import {asyncComputed, useMemoize} from '@vueuse/core';
import {type CarrierIdentifier} from '@myparcel-do/shared';
import {getResolvedCarrier} from '../utils';
import {type ResolvedCarrier} from '../types';

export const useActiveCarrier = useMemoize((carrier: CarrierIdentifier): Ref<ResolvedCarrier> => {
  return asyncComputed(async () => getResolvedCarrier(carrier));
});
