import {createTranslatable, type Translatable} from '@myparcel-dev/shared';

export const createOptionTranslatable = (string: string): Translatable => {
  return createTranslatable(`option_${string}`);
};
