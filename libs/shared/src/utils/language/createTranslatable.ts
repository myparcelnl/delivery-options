import {type AnyTranslatable, type Translatable, type TranslatableWithArgs} from '../../types';

export const createTranslatable = (
  string: string,
  args?: Record<string, AnyTranslatable>,
): Translatable | TranslatableWithArgs => ({
  key: string,
  args,
});
