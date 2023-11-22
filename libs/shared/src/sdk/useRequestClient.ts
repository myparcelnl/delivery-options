import {ref} from 'vue';
import {createStorableMap} from '../utils/createStorableMap';
import {type RequestClient, type RequestHandler, type RequestKey} from '../types';

const requestCache = ref(new Map<string, RequestHandler<unknown>>());
const valueCache = ref(new Map<string, unknown>());

const toStringKey = (queryKey: RequestKey): string => JSON.stringify(queryKey);

export const useRequestClient = <T>(): RequestClient<T> => {
  return {
    ...createStorableMap(requestCache, toStringKey),

    values: createStorableMap(valueCache, toStringKey),
  };
};
