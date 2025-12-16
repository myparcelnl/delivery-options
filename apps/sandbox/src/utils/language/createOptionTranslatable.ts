import {createTranslatable, type Translatable} from '@myparcel-dev/do-shared';

export const createOptionTranslatable = (string: string): Translatable => {
  return createTranslatable(`option_${string}`);
};
