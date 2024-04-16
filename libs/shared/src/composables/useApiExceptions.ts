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
  const translationKey = `error${error.code}`;
  const resolvedError: ParsedError = {
    code: error.code,
    label: translationKey,
  };

  if (error.code === ERROR_MISSING_REQUIRED_PARAMETER) {
    const words = error.message.split(' ');
    const fieldName = words[0];

    resolvedError.label = {
      key: translationKey,
      args: {
        field: {
          key: capitalize(fieldName.replace(/_/g, ' ')),
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
        const resolvedErrorCode = ERROR_REPLACE_MAP[error.code] ?? error.code;

        const isIgnored = IGNORED_ERRORS.includes(resolvedErrorCode);

        const isAlreadyPresent = exceptions.value.some((exception) => exception.code === resolvedErrorCode);

        if (isIgnored || isAlreadyPresent) {
          return;
        }

        exceptions.value.push(parseError({...error, code: resolvedErrorCode}));
      });
    },
    clear,
    exceptions,
    hasExceptions,
  } satisfies UseErrors;
});
