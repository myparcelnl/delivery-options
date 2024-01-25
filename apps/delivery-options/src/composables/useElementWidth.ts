import {inject} from 'vue';
import {INJECT_ELEMENT_WIDTH} from '../data/symbols';

export const useElementWidth = () => {
  const width = inject(INJECT_ELEMENT_WIDTH);

  return width;
};
