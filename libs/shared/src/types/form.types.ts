import {type ComponentOrHtmlElement, type ElementName} from '@myparcel/vue-form-builder';
import {type ElementInstance} from './element.types';
import {type ToRecord} from './common.types';

export interface ElementProps<T = unknown, Props extends Record<string, unknown> = Record<string, unknown>> {
  element: ElementInstance<Props, ComponentOrHtmlElement, ElementName, T>;
  modelValue: T;
}

export type ElementEmits<T = unknown> = (name: 'update:modelValue', value: T) => void;

export interface InputProps<T = unknown> {
  disabled?: boolean;
  id?: string | undefined;
  modelValue: T;
  name?: string;
  readonly?: boolean;
}

export interface InputEmits<T = unknown> {
  'update:modelValue': (value: T) => void;
}

export type WithElement<T = unknown, Props extends InputProps<T> = InputProps<T>> = ElementProps<T, ToRecord<Props>>;
