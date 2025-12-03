import {type Ref} from 'vue';
import {type PromiseOr} from '@myparcel-dev/ts-utils';
import {addProperty} from './addProperty';
import {addLoadingProperty} from './addLoadingProperty';

export type WithLoadingProperties<T, Loading extends Ref<boolean> = Ref<boolean>> = T & {
  load(): PromiseOr<void>;
  loading: Loading;
};

export const addLoadingProperties = <T, Loading extends Ref<boolean> = Ref<boolean>>(
  object: T,
  load: () => PromiseOr<void>,
  loading: Loading,
): WithLoadingProperties<T, Loading> => {
  return addProperty(addLoadingProperty(object, loading), 'load', load);
};
