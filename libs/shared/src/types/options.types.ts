import {type Keyable, type Translation} from './common.types';

export type OptionsProps<T extends SelectOptionValue> = {
  options: SelectOption<T>[];
};

interface BaseSelectOption<Value extends SelectOptionValue = SelectOptionValue> {
  carrier?: string;
  disabled?: boolean;
  icon?: string;
  image?: string;
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

export type SelectOptionValue = Keyable | boolean;

export type SelectOption<Value extends SelectOptionValue = SelectOptionValue> =
  | SelectOptionWithLabel<Value>
  | SelectOptionWithPlainLabel<Value>;
