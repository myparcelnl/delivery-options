import {type Ref} from 'vue';
import {useEventListener} from '@vueuse/core';

export const useClickOutside = (elementRef: Ref<HTMLElement | null>, callback: () => void): void => {
  useEventListener('click', (event) => {
    if (elementRef.value?.contains(event.target as Node)) {
      return;
    }

    callback();
  });
};
