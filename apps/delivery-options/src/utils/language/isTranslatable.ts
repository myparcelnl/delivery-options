import {isString} from 'radash';
import {type AnyTranslatable, type Untranslatable} from '@myparcel-do/shared';
import {isOfType} from '@myparcel/ts-utils';

export const isTranslatable = (translatable: AnyTranslatable): boolean => {
  return isString(translatable) || !isOfType<Untranslatable>(translatable, 'plain');
};
