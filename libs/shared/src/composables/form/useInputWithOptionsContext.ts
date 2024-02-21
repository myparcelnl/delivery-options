import {computed, type ComputedRef, onMounted, watch, type WritableComputedRef, toValue} from 'vue';
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

export interface InputWithOptionsContext<Type extends SelectInputModelValue> {
  elementProps: ComputedRef<InputProps<Type>>;
  id: string;
  model: WritableComputedRef<Type>;
  options: ComputedRef<SelectOption<Type>[]>;
}

export const useInputWithOptionsContext = <Type extends SelectInputModelValue>(
  props: WithElement<InputProps<Type> & OptionsProps<Type>>,
  emit: SelectInputEmits<Type>,
): InputWithOptionsContext<Type> => {
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
      {immediate: Number(toValue(options)?.length) > 0},
    );
  });

  return {
    id,
    // @ts-expect-error todo
    options,
    model,
    elementProps: computed(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const {options: _, ...restProps} = elementProps.value;

      return restProps;
    }),
  };
};
