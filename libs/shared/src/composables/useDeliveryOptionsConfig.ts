import {ref} from 'vue';
import {useCached} from '@vueuse/core';
import {type DeliveryOptionsConfiguration} from '../types';
import {validateDeliveryOptionsConfig} from './validateDeliveryOptionsConfig';

const storage = useCached<DeliveryOptionsConfiguration>(ref({}));

interface UseDeliveryOptionsConfig {
  value: DeliveryOptionsConfiguration;

  update(config: DeliveryOptionsConfiguration): void;
}

export const useDeliveryOptionsConfig = (): UseDeliveryOptionsConfig => {
  return {
    update(config: DeliveryOptionsConfiguration): void {
      storage.value = validateDeliveryOptionsConfig(config);
    },

    value: storage.value,
  };
};
