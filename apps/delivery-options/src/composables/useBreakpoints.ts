// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
import {computed} from 'vue';
import {useMemoize} from '@vueuse/core';
import {useElementWidth} from './useElementWidth';

const BREAKPOINT = 560;

export const useBreakpoints = useMemoize(() => {
  const width = useElementWidth();

  const sm = computed(() => (width?.value ?? 0) < BREAKPOINT);
  const md = computed(() => !sm.value);

  return {sm, md};
});
