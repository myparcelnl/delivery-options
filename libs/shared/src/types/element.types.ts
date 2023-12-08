import {type ComputedRef, type WritableComputedRef} from '@vue/reactivity';
import {type InteractiveElementInstance} from '@myparcel/vue-form-builder';
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ElementInstance<Props extends any = any, Type = unknown> = InteractiveElementInstance<
  Type,
  Props & GlobalFieldProps
>;
