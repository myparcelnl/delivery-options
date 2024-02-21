import {type Untranslatable} from '../../types';
import {createTranslatable} from './createTranslatable';

export const createUntranslatable = (string: string): Untranslatable => ({
  ...createTranslatable(string),
  plain: true,
});
