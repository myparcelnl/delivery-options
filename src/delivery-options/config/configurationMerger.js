import { CARRIER_SETTINGS, DROP_OFF_DAYS } from '@/data/keys/configKeys';

/**
 * These items should never be merged and the new value must always overwrite the default value.
 *
 * @type {String[]}
 */
const KEYS_NOT_ALLOWED_TO_MERGE = [
  CARRIER_SETTINGS,
  DROP_OFF_DAYS,
];

/**
 * Customizer function for merging configurations. Skips values that shouldn't be merged and ignores invalid values.
 *
 * @param {*} defaultValue - The default value.
 * @param {*} newValue - The new value.
 * @param {String} key - Key of the current object.
 *
 * @returns {*}
 */
export const configurationMerger = (defaultValue, newValue, key) => {
  if (KEYS_NOT_ALLOWED_TO_MERGE.includes(key)) {
    return newValue;
  }

  return newValue === null || newValue === '' ? defaultValue : undefined;
};
