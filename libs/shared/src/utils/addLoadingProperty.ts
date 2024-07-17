import {type MaybeRef} from 'vue';
import {addProperty} from './addProperty';

export const addLoadingProperty = <T, L extends MaybeRef<boolean>>(object: T, loading: L): T & {loading: L} => {
  return addProperty(object, 'loading', loading);
};
