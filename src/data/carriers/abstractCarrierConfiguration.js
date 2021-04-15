import * as countryCodes from '@/data/keys/countryCodes';

export class AbstractCarrierConfiguration {
  /**
   * Check if the carrier allows delivery in a specific country.
   *
   * @param {String} country
   * @returns {Boolean}
   */
  allowsDeliveryIn(country) {
    return this.getCountriesForDelivery().includes(country.toUpperCase());
  }

  /**
   * Check if the carrier allows pickup in a specific country.
   *
   * @param {String} country
   * @returns {Boolean}
   */
  allowsPickupIn(country) {
    return this.getCountriesForPickup().includes(country.toUpperCase());
  }

  /**
   * The countries this carrier can deliver to.
   *
   * @returns {String[]}
   */
  getCountriesForDelivery() {
    return [
      countryCodes.CC_AT,
      countryCodes.CC_BE,
      countryCodes.CC_BG,
      countryCodes.CC_CY,
      countryCodes.CC_CZ,
      countryCodes.CC_DE,
      countryCodes.CC_DK,
      countryCodes.CC_EE,
      countryCodes.CC_ES,
      countryCodes.CC_FI,
      countryCodes.CC_FR,
      countryCodes.CC_GB,
      countryCodes.CC_GR,
      countryCodes.CC_HR,
      countryCodes.CC_HU,
      countryCodes.CC_IE,
      countryCodes.CC_IT,
      countryCodes.CC_LT,
      countryCodes.CC_LU,
      countryCodes.CC_LV,
      countryCodes.CC_MT,
      countryCodes.CC_NL,
      countryCodes.CC_PL,
      countryCodes.CC_PT,
      countryCodes.CC_RO,
      countryCodes.CC_SE,
      countryCodes.CC_SI,
      countryCodes.CC_SK,
    ];
  }

  /**
   * The countries this carrier can find pickup locations in.
   *
   * @returns {String[]}
   */
  getCountriesForPickup() {
    return [
      countryCodes.CC_NL,
      countryCodes.CC_BE,
    ];
  }

  /**
   * Default configuration for the carrier.
   *
   * @returns {Object}
   */
  getDefaultConfig() {
    return {};
  }

  /**
   * Features this carrier has.
   *
   * @returns {String[]}
   */
  getFeatures() {
    return [];
  }

  /**
   * Check whether a feature is enabled for this carrier.
   *
   * @param {String|String[]} features
   * @returns {Boolean}
   */
  hasFeature(features) {
    const permissions = this.getFeatures();

    if (Array.isArray(features)) {
      return features.some((feature) => permissions.includes(feature));
    }

    return permissions.includes(features);
  }
}
