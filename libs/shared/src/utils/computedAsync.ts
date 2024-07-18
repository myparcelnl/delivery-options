import {ref, toValue, type ComputedRef} from 'vue';
import {type AsyncComputedOnCancel, type AsyncComputedOptions, asyncComputed} from '@vueuse/core';
import {watchUntil} from './watchUntil';
import {type WithLoadingProperties, addLoadingProperties} from './addLoadingProperties';

export type ComputedAsync<T> = WithLoadingProperties<ComputedRef<T>>;

export const computedAsync = <T>(
  callback: (onCancel: AsyncComputedOnCancel) => T | Promise<T>,
  initialState?: T,
  options?: AsyncComputedOptions & {immediate?: boolean},
): ComputedAsync<T> => {
  const enabled = ref(false);
  const loading = ref(false);

  const computed = asyncComputed(
    async (onCancel) => {
      if (!toValue(enabled)) {
        return initialState;
      }

      return callback(onCancel);
    },
    initialState,
    {
      ...options,
      evaluating: loading,
    },
  );

  const finalComputed = addLoadingProperties(
    computed,
    async () => {
      enabled.value = true;

      return watchUntil(computed);
    },
    loading,
  );

  if (options?.immediate) {
    void finalComputed.load();
  }

  return finalComputed as ComputedAsync<T>;
};
