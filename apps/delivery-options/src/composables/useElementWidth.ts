import {inject} from 'vue';
import {INJECT_ELEMENT_WIDTH} from '../data/symbols';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useElementWidth = () => {
  const width = inject(INJECT_ELEMENT_WIDTH);

  return width;
};
