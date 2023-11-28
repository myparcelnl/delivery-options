import {type MaybeRef, type Ref} from 'vue';
import {asyncComputed, get} from '@vueuse/core';
import {getFullCarrier} from '../utils';
import {type CarrierIdentifier, type FullCarrier, type SupportedPlatformName} from '../types';

export const useFullCarriers = (
  carrierIdentifiers: MaybeRef<CarrierIdentifier[]>,
  platformName?: SupportedPlatformName,
): Ref<FullCarrier[]> => {
  return asyncComputed(
    () => {
      return Promise.all(
        get(carrierIdentifiers).map((carrierIdentifier) => getFullCarrier(carrierIdentifier, platformName)),
      );
    },
    undefined,
    {shallow: false},
  );
};
