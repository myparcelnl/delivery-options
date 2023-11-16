import {type ComponentOrHtmlElement, type ElementName} from '@myparcel/vue-form-builder';
import {type ElementInstance} from './element.types';

export interface ElementProps<T = unknown, Props extends Record<string, unknown> = Record<string, unknown>> {
  element: ElementInstance<Props, ComponentOrHtmlElement, ElementName, T>;
}

export type ElementEmits<T = unknown> = (name: 'update:modelValue', value: T) => void;

export type InputProps<T = unknown> = {
  disabled?: boolean;
  id?: string | undefined;
  modelValue: T;
  name?: string;
  readonly?: boolean;
};

export interface InputEmits<T = unknown> {
  'update:modelValue': (value: T) => void;
}

export type ElProps<T = unknown, B extends InputProps<T> = InputProps<T>> = ElementProps<T, Omit<B, keyof InputProps>>;
