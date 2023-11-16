import {type OneOrMore} from '@myparcel/ts-utils';
import {type FieldOrSection, type ResolvedFieldOrSection} from './types';
import {convertToFields} from './convertToFields';

export const ifAnyCarrierAllows = <I extends FieldOrSection>(
  setting: OneOrMore<string>,
  input: OneOrMore<I>,
): ResolvedFieldOrSection<I>[] => convertToFields(input);
