const CARRIER_IDENTIFIER_SEPARATOR = ':';

/**
 * @param {string} carrierName
 *
 * @returns {string}
 */
export function resolveCarrierName(carrierName) {
  if (carrierName.includes(CARRIER_IDENTIFIER_SEPARATOR)) {
    return carrierName.split(CARRIER_IDENTIFIER_SEPARATOR)[0];
  }

  return carrierName;
}
