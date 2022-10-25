import {isPlainObject} from 'lodash-unified';

/**
 * @param {Object} object - Object to sort.
 *
 * @returns {Object}
 */
export const sortObject = (object: Record<string, unknown>) => {
  return Object
    .keys(object)
    .sort()
    .reduce((acc, val) => {
      let value = object[val];

      if (isPlainObject(object[val]) && val in object) {
        value = sortObject(object[val]);
      }

      return {
        ...acc,
        [val]: value,
      };
    }, {});
};
