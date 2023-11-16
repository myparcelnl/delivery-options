import {type ComputedRef, type WritableComputedRef} from '@vue/reactivity';
import {
  type ComponentOrHtmlElement,
  type ElementName,
  type InteractiveElementInstance,
} from '@myparcel/vue-form-builder';
import {type Replace} from '@myparcel/ts-utils';
import {type ElementProps, type InputProps} from './form.types';

export type ElementContext<T = unknown, Props extends ElementProps = ElementProps> = {
  id: string;
  model: WritableComputedRef<T>;
  elementProps: ComputedRef<Props & InputProps>;
};

export type GlobalFieldProps = {
  description?: string;
  subtext?: string;
  value?: unknown;
};

export type ElementInstance<
  Props extends Record<string, unknown> = Record<string, unknown>,
  C extends ComponentOrHtmlElement = ComponentOrHtmlElement,
  N extends ElementName = string,
  RT = unknown,
> = Replace<InteractiveElementInstance<C, N, RT>, 'props', Props & GlobalFieldProps & Record<string, unknown>>;
