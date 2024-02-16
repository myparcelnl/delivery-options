import {computed, ref} from 'vue';
import {useMemoize} from '@vueuse/core';
import {type PromiseOr, isOfType} from '@myparcel/ts-utils';
import {type ApiException} from '@myparcel/sdk';
import {useApiExceptions} from '../useApiExceptions';
import {type RequestHandler, type RequestKey, type RequestStorage, type UseRequestOptions} from '../../types';
import {useRequestStorage} from './useRequestStorage';
import {requestKeyToString} from './requestKeyToString';

const defaultErrorHandler = (exception: ApiException, requestKey: RequestKey) => {
  const {addException} = useApiExceptions();

  addException(requestKey, exception);
};

const createRequestCallback = <T>(
  callback: () => PromiseOr<T>,
  queryKey: RequestKey,
  options?: UseRequestOptions<T>,
): (() => Promise<T>) => {
  return async () => {
    try {
      const value = await callback();

      await options?.onSuccess?.(value);

      return value;
    } catch (error) {
      if (!isOfType<ApiException>(error, 'data')) {
        throw error;
      }

      const handler = options?.onError ?? defaultErrorHandler;

      await handler(error, queryKey);

      return (options?.fallback ?? null) as T;
    }
  };
};

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
      const cb = createRequestCallback(callback, queryKey, options);

      void storage.set(queryKey, cb());
    }

    data.value = await storage.get(queryKey);

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

export const useRequest = useMemoize(cb, {getKey: (key) => requestKeyToString(key)}) as typeof cb & {clear: () => void};
