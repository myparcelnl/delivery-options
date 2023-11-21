import {onMounted, type Ref, watch, type WritableComputedRef} from 'vue';
import {get} from '@vueuse/core';
import {toArray} from '@myparcel/ts-utils';
import {type SelectInputModelValue, type SelectOptionWithLabel} from '../../types';

export const useInputOptions = <T extends SelectInputModelValue>(
  model: WritableComputedRef<T>,
  options: Ref<SelectOptionWithLabel<T>[]>,
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

        console.log(model.value, '->', newOptions[0].value);
        model.value = newOptions[0].value;
        console.log(model.value);
      },
      {
        immediate: Number(get(options)?.length) > 0,
      },
    );
  });
};
