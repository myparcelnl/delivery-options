import {ref, type Ref, computed, type ComputedRef} from 'vue';
import {camel} from 'radash';
import {useMemoize} from '@vueuse/core';
import {type ApiException, type ErrorResponse} from '@myparcel/sdk';
import {type RequestKey, type AnyTranslatable} from '../types';
import {IGNORED_ERRORS, ERROR_MISSING_REQUIRED_PARAMETER, ERROR_REPLACE_MAP, NUMBER, STREET} from '../data';

const exceptions = ref<ParsedError[]>([]);

export type ParsedError = {
  code: number;
  label: AnyTranslatable;
  status?: number | undefined;
  title?: string | undefined;
  message: string;
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
    status: error.status ? error.status : undefined,
    title: error.title ? error.title : undefined,
    message: error.message,
  };

  if (error.code === ERROR_MISSING_REQUIRED_PARAMETER) {
    const words = error.message.split(' ');

    resolvedError.label = {
      key: translationKey,
      args: {
        field: camel(words[0] === NUMBER ? STREET : words[0]),
      },
    };
  }

  return resolvedError;
};

export const useApiExceptions = useMemoize((): UseErrors => {
  const clear = (): void => {
    exceptions.value.length = 0;
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
