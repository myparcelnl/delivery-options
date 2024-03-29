import {onMounted, provide, ref, type Ref} from 'vue';
import {useResizeObserver} from '@vueuse/core';
import {INJECT_ELEMENT_WIDTH} from '../data/symbols';

const width = ref(0);

export const useProvideElementWidth = (element: Ref<HTMLFormElement | undefined>): void => {
  provide(INJECT_ELEMENT_WIDTH, width);

  const setWidth = () => {
    width.value = element.value?.offsetWidth ?? 0;
  };

  useResizeObserver(element, setWidth);

  onMounted(() => {
    setWidth();
  });
};
