import {isString} from 'radash';
import {type AnyTranslatable} from '../../types';

export const resolveTranslatable = (translatable: AnyTranslatable): string => {
  return isString(translatable) ? translatable : translatable.key;
};
