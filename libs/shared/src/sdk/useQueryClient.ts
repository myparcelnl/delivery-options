import {useLocalStorage} from '@vueuse/core';
import {type QueryKey} from '../types';

const localStorage = useLocalStorage('queryCache', new Map());

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cache = new Map<string, any>();

const toStringKey = (queryKey: QueryKey): string => JSON.stringify(queryKey);

const set: UseQueryClient['set'] = (queryKey, data) => {
  const stringKey = toStringKey(queryKey);

  localStorage.value.set(stringKey, data);
};

const get: UseQueryClient['get'] = (queryKey) => {
  const stringKey = toStringKey(queryKey);

  return localStorage.value.get(stringKey);
};

interface UseQueryClient {
  get<T = unknown>(queryKey: QueryKey): T;

  reset(): void;

  set<T = unknown>(queryKey: QueryKey, data: T): void;
}

export const useQueryClient = (): UseQueryClient => {
  return {
    set,
    get,
    reset() {
      localStorage.value.clear();
    },
  };
};
