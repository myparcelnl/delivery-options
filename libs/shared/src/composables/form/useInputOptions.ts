import {onMounted, type Ref, watch, type WritableComputedRef} from 'vue';
import {get} from '@vueuse/core';
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
        const values = toArray(get(model));
        const hasExistingValue = values.length && newOptions.some((option) => values.includes(option.value));

        if (hasExistingValue || newOptions.length === 0) {
          return;
        }

        model.value = newOptions[0].value;
      },
      {
        immediate: Number(get(options)?.length) > 0,
      },
    );
  });
};
