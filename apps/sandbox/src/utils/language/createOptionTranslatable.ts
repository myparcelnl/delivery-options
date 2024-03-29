import {createTranslatable, type Translatable} from '@myparcel-do/shared';

export const createOptionTranslatable = (string: string): Translatable => {
  return createTranslatable(`option_${string}`);
};
