import {CARRIER_SETTINGS, DROP_OFF_DAYS, carrierFeatures} from '../data/keys/configKeys';
import {CarrierConfigurationFactory} from '../data/carriers/carrierConfigurationFactory';
import {defaultConfiguration} from '../config/defaultConfiguration';
import mergeWith from 'lodash-unified/mergeWith';
import {validatePlatform} from '../delivery-options/config/validatePlatform';

export class ConfigurationMerger {
  /**
   * These items should never be merged and the new value must always overwrite the default value.
   *
   * @type {string[]}
   */
  KEYS_NOT_ALLOWED_TO_MERGE = [
    DROP_OFF_DAYS,
  ];

  /**
   * @type {MyParcel.Platform}
   */
  platform;

  /**
   * @type {MyParcelDeliveryOptions.Configuration}
   */
  input;

  /**
   * @param {MyParcel.Platform} platform
   * @param {MyParcelDeliveryOptions.Configuration} input
   */
  constructor(platform, input) {
    this.platform = validatePlatform(platform);
    this.input = input;
  }

  /**
   * Merge the config data with the default config.
   *
   * @see https://lodash.cobm/docs/4.17.15#mergeWith
   *
   * @returns {MyParcelDeliveryOptions.Configuration}
   */
  getMerged() {
    return mergeWith(
      {},
      defaultConfiguration(this.platform),
      this.input,
      // Without bind() the function loses its scope :(
      this.mergeConfigurations.bind(this),
    );
  }

  /**
   * Customizer function for merging configurations. Skips values that shouldn't be merged and ignores invalid values.
   *
   * @param {*} defaultValue - The default value.
   * @param {*} newValue - The new value.
   * @param {string} key - Key of the current object.
   *
   * @returns {*}
   */
  mergeConfigurations(defaultValue, newValue, key) {
    if (key === CARRIER_SETTINGS) {
      return this.mergeCarrierSettings.bind(this)(newValue);
    }

    if (this.KEYS_NOT_ALLOWED_TO_MERGE.includes(key)) {
      return newValue;
    }

    return newValue === null || newValue === '' ? defaultValue : undefined;
  }

  /**
   * @param {MyParcelDeliveryOptions.CarrierSettings} newValue
   * @returns {MyParcelDeliveryOptions.CarrierSettings}
   */
  mergeCarrierSettings(newValue) {
    return Object
      .keys(newValue)
      .reduce((acc, carrierName) => {
        const carrierConfig = CarrierConfigurationFactory.create(carrierName, this.platform);
        const carrierSettings = newValue[carrierName];

        // Disable carrier settings that aren't allowed in the current carrier + platform combination.
        carrierFeatures.forEach((setting) => {
          if (!carrierConfig.hasFeature(setting)) {
            carrierSettings[setting] = false;
          }
        });

        return {
          ...acc,
          [carrierName]: carrierSettings,
        };
      }, {});
  }
}
