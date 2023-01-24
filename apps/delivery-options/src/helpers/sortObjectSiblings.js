import {get as objectGet, set as objectSet, split} from 'lodash-unified';

/**
 * Sort the sibling keys in an object starting from given path alphabetically.
 *
 * @param {Object} object - Object to search.
 * @param {string} path - Path to get siblings of.
 *
 * @returns {Object}
 */
export function sortObjectSiblings(object, path) {
  const parts = split(path, '.');
  parts.pop();

  const parent = parts.join('.');
  const item = objectGet(object, parent);

  const newObject = Object
    .keys(item)
    .sort()
    .reduce((acc, val) => ({
      ...acc,
      [val]: item[val],
    }), {});

  return objectSet(object, parent, newObject);
}
