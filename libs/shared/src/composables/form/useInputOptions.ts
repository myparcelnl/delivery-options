import {onMounted, type Ref, watch, type WritableComputedRef, toValue} from 'vue';
import {toArray} from '@myparcel/ts-utils';
import {type SelectInputModelValue, type SelectOption} from '../../types';

export const useInputOptions = <T extends SelectInputModelValue>(
  model: WritableComputedRef<T>,
  options: Ref<SelectOption<T>[]>,
): void => {
  onMounted(() => {
    watch(
      options,
      (newOptions) => {
        const values = toArray(toValue(model));
        const hasExistingValue = values.length && newOptions.some((option) => values.includes(option.value));

        if (hasExistingValue || newOptions.length === 0) {
          return;
        }

        model.value = newOptions[0].value;
      },
      {
        immediate: Number(toValue(options)?.length) > 0,
      },
    );
  });
};
