import {isString} from 'radash';
import {type AnyTranslatable} from '@myparcel-do/shared';

export const resolveTranslatable = (translatable: AnyTranslatable): string => {
  return isString(translatable) ? translatable : translatable.key;
};
