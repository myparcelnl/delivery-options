import {computed, type ComputedRef, type WritableComputedRef} from 'vue';
import {
  type SelectInputEmits,
  type SelectInputProps,
  type SelectOptionValue,
  type SelectOptionWithLabel,
  type WithElement,
} from '../../types';
import {useInputOptions} from './useInputOptions';
import {useElementContext} from './useElementContext';

export interface InputWithOptionsContext<T extends SelectOptionValue = SelectOptionValue> {
  elementProps: ComputedRef<Omit<SelectInputProps<T>, 'options'>>;
  id: string;
  model: WritableComputedRef<T>;
  options: ComputedRef<SelectOptionWithLabel<T>[]>;
}

export const useInputWithOptionsContext = <
  T extends SelectOptionValue = SelectOptionValue,
  Props extends WithElement<SelectInputProps<T>> = WithElement<SelectInputProps<T>>,
  Multiple extends boolean = false,
>(
  props: Props,
  emit: SelectInputEmits<T>,
  multiple?: Multiple,
): InputWithOptionsContext<T> => {
  const {id, model, elementProps} = useElementContext<T, unknown, Props, SelectInputEmits<T>>(props, emit);

  const options = computed(() => (props.element.props.options ?? []) as SelectOptionWithLabel<T>[]);

  console.log({options: options.value});

  useInputOptions(model, options);

  return {
    id,
    options,
    model,
    elementProps: computed(() => {
      const {options: _, ...restProps} = elementProps.value;

      return restProps;
    }),
  };
};
