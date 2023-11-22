import {type Ref} from 'vue';
import {type StorableMap} from '../types';

export const createStorableMap = <T, K>(storage: Ref<Map<string, T>>, keyCb: (key: K) => string): StorableMap<T, K> => {
  return {
    set(key, value) {
      storage.value.set(keyCb(key), value);

      return value;
    },

    has(key) {
      return storage.value.has(keyCb(key));
    },

    // @ts-expect-error is fine
    get(key) {
      if (!storage.value.has(keyCb(key))) {
        throw new Error(`Key ${key} not found`);
      }

      return storage.value.get(keyCb(key));
    },

    clear() {
      storage.value.clear();
    },

    storage,
  };
};
