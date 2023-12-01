import {type OptionsProps, type SelectOptionValue} from './options.types';
import {type ElementEmits, type InputProps} from './form.types';

export type CheckboxModelValue = string | boolean;

export type CheckboxGroupEmits<T extends CheckboxGroupModelValue> = ElementEmits<T>;

export type CheckboxProps<T extends CheckboxModelValue> = InputProps<T> & {value: T};

export type CheckboxEmits<T extends CheckboxModelValue> = ElementEmits<T>;

export type CheckboxGroupModelValue = string;

export type CheckboxGroupProps<T extends CheckboxGroupModelValue> = InputProps<T> & OptionsProps<T>;

export type CurrencyInputModelValue = string | number;

export type CurrencyInputProps = InputProps<CurrencyInputModelValue>;

export type CurrencyInputEmits = ElementEmits<number>;

export type CodeEditorModelValue = string;

export type CodeEditorProps = InputProps<CodeEditorModelValue>;

export type CodeEditorEmits = ElementEmits<CodeEditorModelValue>;

export type SelectInputModelValue = SelectOptionValue;

export type SelectInputProps<T extends SelectInputModelValue> = InputProps<T> & OptionsProps<T>;

export type SelectInputEmits<T extends SelectInputModelValue> = ElementEmits<T>;

export type MultiSelectInputModelValue = SelectOptionValue[];

export type NumberInputModelValue = string | number;

export type NumberInputProps = InputProps<NumberInputModelValue>;

export type NumberInputEmits = ElementEmits<number>;

export type RadioGroupModelValue = string;

export type RadioGroupProps<T extends RadioGroupModelValue> = InputProps<T> & OptionsProps<T>;

export type RadioGroupEmits<T extends RadioGroupModelValue> = ElementEmits<T>;

export type TextInputProps = InputProps<string>;

export type TextInputEmits = ElementEmits<string>;

export type TextAreaModelValue = string;

export type TextAreaProps = InputProps<TextAreaModelValue>;

export type TextAreaEmits = ElementEmits<TextAreaModelValue>;

export type TimeInputModelValue = string;

export type TimeInputProps = InputProps<TimeInputModelValue>;

export type TimeInputEmits = ElementEmits<TimeInputModelValue>;

export type ToggleInputModelValue = boolean;

export type ToggleInputProps = InputProps<ToggleInputModelValue>;

export type ToggleInputEmits = ElementEmits<ToggleInputModelValue>;
