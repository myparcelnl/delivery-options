import {type Ref, ref} from 'vue';
import {type AsyncComputedOnCancel, type AsyncComputedOptions, asyncComputed} from '@vueuse/core';

export interface ComputedAsync<T> extends Ref<T> {
  loading: Ref<boolean>;
}

export const computedAsync = <T>(
  callback: (onCancel: AsyncComputedOnCancel) => T | Promise<T>,
  initialState?: T,
  optionsOrRef?: Ref<boolean> | AsyncComputedOptions,
): ComputedAsync<T> => {
  const loading = ref(false);

  const computed = asyncComputed(callback, initialState, {
    ...optionsOrRef,
    evaluating: loading,
  });

  Object.defineProperty(computed, 'loading', {
    get() {
      return loading;
    },
  });

  return computed as ComputedAsync<T>;
};
