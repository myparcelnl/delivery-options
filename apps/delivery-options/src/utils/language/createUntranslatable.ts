import {type Untranslatable} from '@myparcel-do/shared';
import {createTranslatable} from './createTranslatable';

export const createUntranslatable = (string: string): Untranslatable => ({
  ...createTranslatable(string),
  plain: true,
});
