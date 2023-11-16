import {type QueryKey} from '@myparcel-do/shared';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cache = new Map<string, any>();

const toStringKey = (queryKey: QueryKey): string => JSON.stringify(queryKey);

const set: UseQueryClient['set'] = (queryKey, data) => {
  const stringKey = toStringKey(queryKey);

  cache.set(stringKey, data);
};

const get: UseQueryClient['get'] = (queryKey) => {
  const stringKey = toStringKey(queryKey);

  return cache.get(stringKey);
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
      cache.clear();
    },
  };
};
