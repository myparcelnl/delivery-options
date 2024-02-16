import {type MaybeRef} from 'vue';

export const addLoadingProperty = <T, L extends MaybeRef<boolean>>(object: T, loading: L): T & {loading: L} => {
  Object.defineProperty(object, 'loading', {
    get() {
      return loading;
    },
  });

  return object as T & {loading: L};
};
