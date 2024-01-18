import {computed, ref} from 'vue';
import {useMemoize} from '@vueuse/core';
import {type PromiseOr} from '@myparcel/ts-utils';
import {type RequestHandler, type RequestKey, type RequestStorage, type UseRequestOptions} from '../../types';
import {useRequestStorage} from './useRequestStorage';
import {requestKeyToString} from './requestKeyToString';

const createRequestHandler = <T>(
  storage: RequestStorage,
  queryKey: RequestKey,
  callback: () => PromiseOr<T>,
  options?: UseRequestOptions<T>,
): RequestHandler<T> => {
  const data = ref(null);
  const loading = computed(() => !data.value);

  const load = async () => {
    if (!storage.has(queryKey)) {
      void storage.set(queryKey, callback());
    }

    try {
      data.value = await storage.get(queryKey);
    } catch (error) {
      // @ts-expect-error todo
      await options?.onError?.(error);

      data.value = null;
    }

    // @ts-expect-error todo
    await options?.onSuccess?.(data.value);

    storage.set(queryKey, data.value);
  };

  void load();

  return {
    data,
    loading,
    load,
  };
};

const cb = <T>(
  key: RequestKey,
  callback: () => PromiseOr<T>,
  options?: UseRequestOptions<T>,
): RequestHandler<T extends Promise<infer U> ? U : T> => {
  const requestStorage = useRequestStorage();

  const query = createRequestHandler<T>(requestStorage, key, callback, options);

  void query.load();

  return query as RequestHandler<T extends Promise<infer U> ? U : T>;
};

export const useRequest = useMemoize(cb, {getKey: (key) => requestKeyToString(key)}) as typeof cb;
