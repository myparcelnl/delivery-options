import {type Ref} from 'vue';
import {asyncComputed} from '@vueuse/core';
import {type FullCarrier} from '../utils/getFullCarriers';
import {getFullCarrier} from '../utils/getFullCarrier';
import {type CarrierIdentifier, type SupportedPlatformName} from '../types';

export const useFullCarrier = (
  carrierIdentifier: CarrierIdentifier,
  platformName?: SupportedPlatformName,
): Ref<FullCarrier> => {
  return asyncComputed(async () => getFullCarrier(carrierIdentifier, platformName));
};
