import {type UnwrapRef} from 'vue';

// Define a generic type for the store
// Define a generic type for the store with an optional payload for update
export type DeliveryOptionsStore<T, U = T> = {
  state: UnwrapRef<T>;
  update: (payload: U) => void;
  reset: () => void;
};

export * from './useAddressStore';
export * from './useConfigStore';
