import {type Ref} from 'vue';
import {asyncComputed} from '@vueuse/core';
import {getFullCarrier} from '../utils';
import {type CarrierIdentifier, type FullCarrier, type SupportedPlatformName} from '../types';

export const useFullCarrier = (
  carrierIdentifier: CarrierIdentifier,
  platformName?: SupportedPlatformName,
): Ref<FullCarrier> => {
  return asyncComputed(async () => getFullCarrier(carrierIdentifier, platformName));
};
