import {ref} from 'vue';
import {useMemoize} from '@vueuse/core';

export const useSelectedPickupLocation = useMemoize(() => {
  return {
    model: ref(),
  };
});
