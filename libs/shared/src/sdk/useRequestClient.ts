import {ref} from 'vue';
import {isNumber, isString} from 'radash';
import {createStorableMap} from '../utils';
import {type RequestClient, type RequestHandler, type RequestKey} from '../types';

const requestCache = ref(new Map<string, RequestHandler<unknown>>());
const valueCache = ref(new Map<string, unknown>());

const toStringKey = (queryKey: string | number | object | RequestKey): string => {
  if (isString(queryKey) || isNumber(queryKey)) {
    return String(queryKey);
  }

  if (Array.isArray(queryKey)) {
    return queryKey.map(toStringKey).join(':');
  }

  return JSON.stringify(queryKey);
};

export const useRequestClient = <T>(): RequestClient<T> => {
  return {
    ...createStorableMap(requestCache, toStringKey),

    values: createStorableMap(valueCache, toStringKey),
  };
};
