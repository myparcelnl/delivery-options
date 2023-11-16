import {isOfType, type OneOrMore, toArray} from '@myparcel/ts-utils';
import {formField} from '../formField';
import {type SettingsField} from '../../types/form.types';
import {type SettingsSection} from '../../types';
import {type FieldOrSection, type ResolvedFieldOrSection} from './types';

export const convertToFields = <I extends FieldOrSection>(input: OneOrMore<I>): ResolvedFieldOrSection<I>[] =>
  toArray(input).map((item) => {
    if (isOfType<SettingsField>(item, 'Component') || isOfType<SettingsSection>(item, 'fields')) {
      return item as ResolvedFieldOrSection<I>;
    }

    return formField(item) as ResolvedFieldOrSection<I>;
  });
