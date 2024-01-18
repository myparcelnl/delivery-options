import {ref} from 'vue';
import {useMemoize} from '@vueuse/core';
import {createStorableMap} from '../../utils';
import {type RequestStorage} from '../../types';
import {requestKeyToString} from './requestKeyToString';

const valueCache = ref(new Map<string, unknown>());

export const useRequestStorage = useMemoize((): RequestStorage => {
  return createStorableMap(valueCache, requestKeyToString);
});
