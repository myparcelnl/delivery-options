import {isPlainObject} from 'lodash-unified';

/**
 * Flatten an object's keys recursively.
 *
 */
export function flattenObject(object: Record<string, unknown>): Record<string, unknown> {
  const flattenObj = <O extends Record<string, unknown>>(obj: O, keys: (keyof O)[] = []): Record<string, unknown> => {
    return Object.keys(obj).reduce((acc, key) => {
      if (isPlainObject(obj[key])) {
        return {
          ...acc,
          ...flattenObj(obj[key], keys.concat(key)),
        };
      }

      return {
        ...acc,
        ...{
          [keys.concat(key).join('.')]: obj[key],
        },
      };
    }, {});
  };

  return flattenObj(object);
}
