import {type OptionsProps, type SelectOptionValue} from './options.types';
import {type InputEmits, type InputProps} from './form.types';
import {type ArrayItem, type Keyable} from './common.types';

export type CheckboxGroupModelValue = (string | boolean)[];

export interface CheckboxGroupProps<T extends CheckboxGroupModelValue>
  extends InputProps<T>,
    OptionsProps<ArrayItem<T>> {}

export type CheckboxGroupEmits<T extends CheckboxGroupModelValue> = InputEmits<T>;

export type CurrencyInputModelValue = string | number;

export type CurrencyInputProps = InputProps<CurrencyInputModelValue>;

export type CurrencyInputEmits = InputEmits<number>;

export type CheckboxInputModelValue = Keyable | boolean;

export type CodeEditorModelValue = string;

export type CodeEditorProps = InputProps<CodeEditorModelValue>;

export type CodeEditorEmits = InputEmits<CodeEditorModelValue>;

export type SelectInputModelValue = SelectOptionValue;

export interface SelectInputProps<T extends SelectInputModelValue> extends InputProps<T>, OptionsProps<T> {}

export type SelectInputEmits<T extends SelectInputModelValue> = InputEmits<T>;

export type MultiSelectInputModelValue = SelectOptionValue[];

export type NumberInputModelValue = string | number;

export type NumberInputProps = InputProps<NumberInputModelValue>;

export type NumberInputEmits = InputEmits<number>;

export type RadioGroupModelValue = Keyable;

export type RadioGroupProps<T extends RadioGroupModelValue> = InputProps<T> & OptionsProps<T>;

export type RadioGroupEmits<T extends RadioGroupModelValue> = InputEmits<T>;

export type TextInputProps = InputProps<string>;

export type TextInputEmits = InputEmits<string>;

export type TextAreaModelValue = string;

export type TextAreaProps = InputProps<TextAreaModelValue>;

export type TextAreaEmits = InputEmits<TextAreaModelValue>;

export type TimeInputModelValue = string;

export type TimeInputProps = InputProps<TimeInputModelValue>;

export type TimeInputEmits = InputEmits<TimeInputModelValue>;

export type ToggleInputModelValue = boolean;

export type ToggleInputProps = InputProps<ToggleInputModelValue>;

export type ToggleInputEmits = InputEmits<ToggleInputModelValue>;
