import {isObject} from 'radash';

export const crushObject = (obj: Record<string, unknown>, prefix = ''): Record<string, unknown> => {
  const result: Record<string, unknown> = {};

  Object.entries(obj).forEach(([key, value]) => {
    const newPrefix = prefix ? `${prefix}.${key}` : key;

    if (isObject(value) && !Array.isArray(value)) {
      Object.assign(result, crushObject(value as Record<string, unknown>, newPrefix));
    } else {
      result[newPrefix] = value;
    }
  });
  return result;
};
