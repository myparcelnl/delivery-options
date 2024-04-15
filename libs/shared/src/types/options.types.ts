import {type AnyTranslatable} from './language.types';
import {type CarrierIdentifier} from './config.types';

export type OptionsProps<T extends SelectOptionValue> = {
  options: SelectOption<T>[];
};

interface BaseSelectOption<Value extends SelectOptionValue = SelectOptionValue> {
  carrier?: CarrierIdentifier;
  disabled?: boolean;
  ecoFriendly?: number;
  icon?: string;
  image?: string;
  label?: AnyTranslatable;
  price?: number;
  selected?: boolean;
  value: Value;
}

export type SelectOptionValue = string | object | boolean;

export interface SelectOption<
  Value extends SelectOptionValue = SelectOptionValue,
  T extends AnyTranslatable = AnyTranslatable,
> extends BaseSelectOption<Value> {
  label: T;
}
