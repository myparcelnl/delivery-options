import {isNumber, isString} from 'radash';
import {type RequestKey} from '../../types';

export const requestKeyToString = (queryKey: string | number | object | RequestKey): string => {
  if (isString(queryKey) || isNumber(queryKey)) {
    return String(queryKey);
  }

  if (Array.isArray(queryKey)) {
    return queryKey.map(requestKeyToString).join(':');
  }

  return JSON.stringify(queryKey);
};
