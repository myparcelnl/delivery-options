import {type UnwrapRef} from 'vue';

/**
 * Define a generic type for the store where the update method accepts a payload and an array of arguments
 */
export type DeliveryOptionsStore<T, U = T, A extends unknown[] = []> = {
  state: UnwrapRef<T>;
  update: (payload: U, ...args: A) => void;
  reset: () => void;
};

export * from './useAddressStore';
export * from './useConfigStore';
