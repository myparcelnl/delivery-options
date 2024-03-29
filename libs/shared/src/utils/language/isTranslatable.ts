import {isString} from 'radash';
import {isOfType} from '@myparcel/ts-utils';
import {type AnyTranslatable, type Untranslatable} from '../../types';

export const isTranslatable = (translatable: AnyTranslatable): boolean => {
  return isString(translatable) || !isOfType<Untranslatable>(translatable, 'plain');
};
