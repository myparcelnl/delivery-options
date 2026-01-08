import {type ElementInstance} from './element.types';
import {type ToRecord} from './common.types';

export interface ElementProps<Type = unknown, Props extends Record<string, unknown> = Record<string, unknown>> {
  element: ElementInstance<Props, Type>;
  modelValue: Type;
}

export type ElementEmits<Type = unknown> = (name: 'update:modelValue', value: Type) => void;

export interface InputProps {
  disabled?: boolean;
  id?: string | undefined;
  name?: string;
  readonly?: boolean;
}

export type WithElement<Props extends InputProps = InputProps> = ElementProps<unknown, ToRecord<Props>>;
