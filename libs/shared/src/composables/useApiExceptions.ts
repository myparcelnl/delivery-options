import {ref, type Ref, computed, type ComputedRef} from 'vue';
import {useMemoize} from '@vueuse/core';
import {type ApiException, type ErrorResponse} from '@myparcel/sdk';
import {type RequestKey} from '../types';
import {IGNORED_ERRORS} from '../data';

const exceptions = ref<ErrorResponse['errors']>([]);

interface UseErrors {
  exceptions: Ref<ErrorResponse['errors']>;
  hasExceptions: ComputedRef<boolean>;
  addException(requestKey: RequestKey, exception: ApiException): void;
  clear(): void;
}

export const useApiExceptions = useMemoize((): UseErrors => {
  const clear = (): void => {
    exceptions.value = [];
  };

  const hasExceptions = computed(() => exceptions.value.length > 0);

  return {
    addException(requestKey, exception) {
      exception.data.errors.forEach((error) => {
        const isIgnored = IGNORED_ERRORS.includes(error.code);
        const isAlreadyPresent = exceptions.value.some((exception) => exception.code === error.code);

        if (isIgnored || isAlreadyPresent) {
          return;
        }

        exceptions.value.push(error);
      });
    },
    clear,
    exceptions,
    hasExceptions,
  } as UseErrors;
});
