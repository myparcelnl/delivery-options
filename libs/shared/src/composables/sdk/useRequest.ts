import {computed, ref} from 'vue';
import {type PromiseOr} from '@myparcel/ts-utils';
import {type RequestClient, type RequestHandler, type RequestKey, type UseRequestOptions} from '../../types';
import {useRequestClient} from './useRequestClient';

const createRequestHandler = <T>(
  requestClient: RequestClient<T>,
  queryKey: RequestKey,
  callback: () => PromiseOr<T>,
  options?: UseRequestOptions<T>,
): RequestHandler<T> => {
  const data = ref(null);
  const loading = computed(() => !data.value);

  const load = async () => {
    if (!requestClient.values.has(queryKey)) {
      void requestClient.values.set(queryKey, callback());
    }

    try {
      data.value = await requestClient.values.get(queryKey);
    } catch (error) {
      // @ts-expect-error todo
      await options?.onError?.(error);

      data.value = null;
    }

    // @ts-expect-error todo
    await options?.onSuccess?.(data.value);

    requestClient.values.set(queryKey, data.value);
  };

  void load();

  return {
    data,
    loading,
    load,
  };
};

export const useRequest = <T>(
  key: RequestKey,
  callback: () => PromiseOr<T>,
  options?: UseRequestOptions<T>,
): RequestHandler<T> => {
  const requestClient = useRequestClient<T>();

  if (!requestClient.has(key)) {
    const newQuery = createRequestHandler<T>(requestClient, key, callback, options);

    requestClient.set(key, newQuery);
  }

  const query = requestClient.get(key);

  void query.load();

  return query;
};
