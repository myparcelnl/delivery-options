import {ref} from 'vue';
import {useMemoize} from '@vueuse/core';
import {type RequestStorage} from '../../types';
import {requestKeyToString} from './requestKeyToString';

export const useRequestStorage = useMemoize((): RequestStorage => {
  const valueCache = ref(new Map<string, unknown>());

  return {
    set(key, value) {
      valueCache.value.set(requestKeyToString(key), value);

      return value;
    },

    has(key) {
      return valueCache.value.has(requestKeyToString(key));
    },

    // @ts-expect-error is fine
    get(key) {
      if (!valueCache.value.has(requestKeyToString(key))) {
        throw new Error(`Key ${key} not found`);
      }

      return valueCache.value.get(requestKeyToString(key));
    },

    clear() {
      valueCache.value.clear();
    },

    storage: valueCache,
  };
});
