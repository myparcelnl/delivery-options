import {ref, type Ref, computed, type ComputedRef, capitalize} from 'vue';
import {useMemoize} from '@vueuse/core';
import {type ApiException, type ErrorResponse} from '@myparcel/sdk';
import {type RequestKey, type AnyTranslatable} from '../types';
import {IGNORED_ERRORS, ERROR_MISSING_REQUIRED_PARAMETER, ERROR_REPLACE_MAP} from '../data';

const exceptions = ref<ParsedError[]>([]);

type ParsedError = {
  code: number;
  label: AnyTranslatable;
};

interface UseErrors {
  exceptions: Ref<ParsedError[]>;
  hasExceptions: ComputedRef<boolean>;
  addException(requestKey: RequestKey, exception: ApiException): void;
  clear(): void;
}

const parseError = (error: ErrorResponse['errors'][number]): ParsedError => {
  const resolvedCode = ERROR_REPLACE_MAP[error.code] ?? error.code;

  const resolvedError: ParsedError = {
    code: resolvedCode,
    label: `error${resolvedCode}`,
  };

  if (resolvedCode === ERROR_MISSING_REQUIRED_PARAMETER) {
    const words = error.message.split(' ');

    resolvedError.label = {
      key: `error${resolvedCode}`,
      args: {
        field: {
          key: capitalize(words[0]),
          plain: true,
        },
      },
    };
  }

  return resolvedError;
};

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

        exceptions.value.push(parseError(error));
      });
    },
    clear,
    exceptions,
    hasExceptions,
  } satisfies UseErrors;
});
