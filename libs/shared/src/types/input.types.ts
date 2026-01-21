import {type OptionsProps, type SelectOptionValue} from './options.types';
import {type ElementEmits, type InputProps} from './form.types';

export type CheckboxModelValue = string | boolean;

export type CheckboxGroupEmits<T extends CheckboxGroupModelValue> = ElementEmits<T>;

export type CheckboxProps<T extends CheckboxModelValue> = InputProps & {value: T};

export type CheckboxEmits<T extends CheckboxModelValue> = ElementEmits<T>;

export type CheckboxGroupModelValue = string[];

export type CheckboxGroupProps<T extends CheckboxGroupModelValue> = InputProps & OptionsProps<T>;

export type CurrencyInputModelValue = string | number;

/**
 * @deprecated Use InputProps directly instead
 */
export type CurrencyInputProps = InputProps;

export type CurrencyInputEmits = ElementEmits<number>;

export type SelectInputModelValue = SelectOptionValue;

export type SelectInputProps<T extends SelectInputModelValue> = InputProps &
  OptionsProps<T> & {placeholder?: string; loading?: boolean};

export type SelectInputEmits<T extends SelectInputModelValue> = ElementEmits<T>;

export type MultiDateSelectModelValue = Date[];

/**
 * @deprecated Use InputProps directly instead
 */
export type MultiDateSelectProps = InputProps;

export type MultiDateSelectEmits = ElementEmits<MultiDateSelectModelValue>;

export type NumberInputModelValue = string | number;

/**
 * @deprecated Use InputProps directly instead
 */
export type NumberInputProps = InputProps;

export type NumberInputEmits = ElementEmits<number>;

export type RadioGroupModelValue = string;

export type RadioGroupProps<T extends RadioGroupModelValue = RadioGroupModelValue> = InputProps & OptionsProps<T>;

export type RadioGroupEmits<T extends RadioGroupModelValue = RadioGroupModelValue> = ElementEmits<T>;

export type TextInputModelValue = string | number | undefined;

/**
 * @deprecated Use InputProps directly instead
 */
export type TextInputProps = InputProps;

export type TextInputEmits = ElementEmits<string>;

export type TextAreaModelValue = string;

/**
 * @deprecated Use InputProps directly instead
 */
export type TextAreaProps = InputProps;

export type TextAreaEmits = ElementEmits<TextAreaModelValue>;

export type TimeInputModelValue = string;

/**
 * @deprecated Use InputProps directly instead
 */
export type TimeInputProps = InputProps;

export type TimeInputEmits = ElementEmits<TimeInputModelValue>;

export type ToggleInputModelValue = boolean;

/**
 * @deprecated Use InputProps directly instead
 */
export type ToggleInputProps = InputProps;

export type ToggleInputEmits = ElementEmits<ToggleInputModelValue>;
