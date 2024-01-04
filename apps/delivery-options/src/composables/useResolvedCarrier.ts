import {type Ref} from 'vue';
import {asyncComputed, useMemoize} from '@vueuse/core';
import {type CarrierIdentifier} from '@myparcel-do/shared';
import {getResolvedCarrier} from '../utils';
import {type ResolvedCarrier} from '../types';
import {useConfigStore} from '../stores';

export const useResolvedCarrier = useMemoize((carrier: CarrierIdentifier): Ref<ResolvedCarrier> => {
  const config = useConfigStore();

  return asyncComputed(async () => getResolvedCarrier(carrier, config.platform));
});
