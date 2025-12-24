import {type ComputedRef, type WritableComputedRef} from 'vue';
import {type InputProps} from './form.types';

export type ElementContext<Type = unknown, Props extends Record<string, unknown> = Record<string, unknown>> = {
  id: string;
  model: WritableComputedRef<Type>;
  elementProps: ComputedRef<Props & InputProps>;
};

export type GlobalFieldProps = {
  description?: string;
  subtext?: string;
  value?: unknown;
};

export interface ElementInstance<Props extends Record<string, unknown> = Record<string, unknown>, Type = unknown> {
  name: string;
  props: Props & GlobalFieldProps;
  isValid: boolean;
  isDisabled: boolean;
  isReadOnly: boolean;
  isSuspended: boolean;
  isVisible: boolean;
  label: string;
}
