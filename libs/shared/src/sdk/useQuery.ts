import {computed, ref} from 'vue';
import {useMemoize} from '@vueuse/core';
import {type UseQuery} from '../types';
import {useQueryClient} from './useQueryClient';

export const useQuery: UseQuery = useMemoize((queryKey, callback, options) => {
  const client = useQueryClient();

  const data = ref(null);
  const loading = computed(() => !data.value);

  const suspense = async () => {
    if (!client.get(queryKey)) {
      client.set(queryKey, callback());
    }

    data.value = await client.get(queryKey);

    // @ts-expect-error todo
    await options?.onSuccess?.(data.value);

    client.set(queryKey, data.value);
  };

  void suspense();

  return {
    data,
    loading,
    suspense,
  };
});
