import {type CarrierIdentifier} from './config.types';
import {type Translation} from './common.types';

export type OptionsProps<T extends SelectOptionValue> = {
  options: SelectOption<T>[];
};

interface BaseSelectOption<Value extends SelectOptionValue = SelectOptionValue> {
  carrier?: CarrierIdentifier;
  disabled?: boolean;
  ecoFriendly?: number;
  icon?: string;
  image?: string;
  label?: string;
  price?: number;
  selected?: boolean;
  value: Value;
}

export interface SelectOptionWithLabel<
  Value extends SelectOptionValue = SelectOptionValue,
  T extends Translation = Translation,
> extends BaseSelectOption<Value> {
  label: T;
}

export interface SelectOptionWithPlainLabel<
  Value extends SelectOptionValue = SelectOptionValue,
  T extends Translation = Translation,
> extends BaseSelectOption<Value> {
  plainLabel: T;
}

export type SelectOptionValue = string | object | boolean;

export type SelectOption<Value extends SelectOptionValue = SelectOptionValue> =
  | SelectOptionWithLabel<Value>
  | SelectOptionWithPlainLabel<Value>;
