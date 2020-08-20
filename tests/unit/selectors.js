/**
 * Create a [data-test-<type>="<id>"] selector string.
 *
 * @param {String} id
 * @param {String} type
 * @returns {String}
 */
export const dataTest = (id, type = 'id') => `[data-test-${type}="${id}"]`;
