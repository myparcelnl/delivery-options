import {computed, type ComputedRef, onMounted, watch, type WritableComputedRef} from 'vue';
import {get} from '@vueuse/core';
import {
  type InputProps,
  type OptionsProps,
  type SelectInputEmits,
  type SelectInputModelValue,
  type SelectOption,
  type WithElement,
} from '../../types';
import {useElementContext} from './useElementContext';
import {calculateInitialValue} from './calculateInitialValue';

export interface InputWithOptionsContext<T extends SelectInputModelValue> {
  elementProps: ComputedRef<InputProps<T>>;
  id: string;
  model: WritableComputedRef<T>;
  options: ComputedRef<SelectOption<T>[]>;
}

export const useInputWithOptionsContext = <T extends SelectInputModelValue = SelectInputModelValue>(
  props: WithElement<T, InputProps<T> & OptionsProps<T>>,
  emit: SelectInputEmits<T>,
): InputWithOptionsContext<T> => {
  // @ts-expect-error todo
  const {id, model, elementProps} = useElementContext(props, emit);

  const options = computed(() => props.element.props.options ?? []);

  onMounted(() => {
    watch(
      options,
      (newOptions) => {
        const value = calculateInitialValue(model, newOptions);

        if (value === null) {
          return;
        }

        model.value = value;
      },
      {immediate: Number(get(options)?.length) > 0},
    );
  });

  return {
    id,
    // @ts-expect-error todo
    options,
    model,
    elementProps: computed(() => {
      // @ts-expect-error todo
      const {options: _, ...restProps} = elementProps.value;

      return restProps;
    }),
  };
};
