import {type Ref} from 'vue';
import {useEventListener} from '@vueuse/core';
import {ElementEvent} from '@myparcel-do/shared';

export const useClickOutside = (elementRef: Ref<HTMLElement | null>, callback: () => void): void => {
  useEventListener(ElementEvent.Click, (event) => {
    if (elementRef.value?.contains(event.target as Node)) {
      return;
    }

    callback();
  });
};
