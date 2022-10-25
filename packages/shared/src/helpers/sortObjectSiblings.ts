import {get, set, split} from 'lodash-unified';

/**
 * Sort the sibling keys in an object starting from given path alphabetically.
 *
 * @param {Object} object - Object to search.
 * @param {string} path - Path to get siblings of.
 *
 * @returns {Object}
 */
export const sortObjectSiblings = (object: Record<string, unknown>, path: string) => {
  const parts = split(path, '.');
  parts.pop();

  const parent = parts.join('.');
  const item = get(object, parent) ?? {};

  const newObject = Object
    .keys(item)
    .sort()
    .reduce((acc, val) => ({
      ...acc,
      [val]: item[val],
    }), {});

  return set(object, parent, newObject);
};
