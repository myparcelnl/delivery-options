import { countryCodes } from '@/data/keys/countryCodes';
import { flatten } from 'lodash-es';
import { validatePlatform } from '@/delivery-options/config/validatePlatform';

export class AbstractCarrierConfiguration {
  /**
   * @type {MyParcel.Platform}
   */
  platform;

  /**
   * @param {MyParcel.Platform} platform
   */
  constructor(platform) {
    this.platform = validatePlatform(platform);
  }

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
      countryCodes.BELGIUM,
      countryCodes.NETHERLANDS,
    ];
  }

  /**
   * The countries this carrier can find pickup locations in.
   *
   * @returns {String[]}
   */
  getCountriesForPickup() {
    return [
      countryCodes.BELGIUM,
      countryCodes.NETHERLANDS,
    ];
  }

  /**
   * Features this carrier has.
   *
   * @returns {Object<MyParcel.Platform, String[]>}
   */
  getFeatures() {
    return {};
  }

  /**
   * Get the features for the current platform.
   *
   * @returns {String[]|String[][]}
   */
  getPlatformFeatures() {
    const features = this.getFeatures();

    if (!features.hasOwnProperty(this.platform)) {
      return [];
    }

    return features[this.platform];
  }

  /**
   * Check whether a feature is enabled for this carrier.
   *
   * @param {String|String[]} features
   * @returns {Boolean}
   */
  hasFeature(features) {
    const platformFeatures = this.getPlatformFeatures();
    const permissions = flatten(platformFeatures);

    if (Array.isArray(features)) {
      return flatten(features).every((feature) => permissions.includes(feature));
    }

    return permissions.includes(features);
  }
}
