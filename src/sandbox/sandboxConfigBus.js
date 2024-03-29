import * as CONFIG from '@/data/keys/configKeys';
import { CarrierConfigurationFactory } from '@/data/carriers/carrierConfigurationFactory';
import Vue from 'vue';
import { defaultAddress } from '@/data/defaultAddress';
import { demoConfiguration } from '@/sandbox/config/demoConfiguration';
import { fetchCarrierData } from '@/delivery-options/data/carriers/fetchCarrierData';
import isEqual from 'lodash-es/isEqual';
import isPlainObject from 'lodash-es/isPlainObject';
import objectGet from 'lodash-es/get';
import objectHas from 'lodash-es/has';
import objectSet from 'lodash-es/set';
import { platforms } from '@/config/platform/platforms';
import { sandboxPlatformCarrierMap } from '@/sandbox/config/sandboxPlatformCarrierMap';
import { settingHasCarrierOverride } from '@/delivery-options/config/settingHasCarrierOverride';
import { sortObject } from '@/helpers/sortObject';
import { sortObjectSiblings } from '@/helpers/sortObjectSiblings';

export const sandboxConfigBus = new Vue({
  name: 'SandboxConfigBus',

  data() {
    return {
      /**
       * @type {MyParcel.Platform}
       */
      platform: platforms[0],

      /**
       * Data for all carriers.
       *
       * @type {Array}
       */
      carrierData: [],

      /**
       * Set containing all items that were actually rendered in the settings form.
       *
       * @type {Set}
       */
      itemsInForm: new Set(),

      /**
       * The full settings form.
       *
       * @type {Object}
       */
      settings: null,
    };
  },

  created() {
    this.settings = platforms
      .reduce((acc, platform) => {
        const config = demoConfiguration(platform);

        // Get all settings allowing carrier overrides.
        Object
          .keys(config[CONFIG.KEY])
          .filter(settingHasCarrierOverride)
          .forEach((item) => {
            const originalItemPath = [CONFIG.KEY, item].join('.');
            const value = objectGet(config, originalItemPath);

            // Copy the value to all carriers that allow this setting
            sandboxPlatformCarrierMap[platform].forEach((carrier) => {
              const carrierConfig = CarrierConfigurationFactory.create(carrier, platform);

              if (carrierConfig.hasFeature(item)) {
                objectSet(config, [CONFIG.KEY, CONFIG.CARRIER_SETTINGS, carrier, item], value);
              }
            });
          });

        return {
          ...acc,
          [platform]: sortObject({
            ...config,
            address: defaultAddress[platform],
          }),
        };
      }, {});
  },

  methods: {
    async fetchCarrierData(carrier) {
      this.carrierData = await fetchCarrierData(carrier);

      return this.carrierData;
    },

    /**
     * Get a setting from the user's settings.
     *
     * @param {...string} option - String key to search for.
     *
     * @returns {*}
     */
    getSetting(...option) {
      if (!this.settings || !this.settings.hasOwnProperty(this.platform)) {
        return;
      }

      return this.get(this.settings, ...option);
    },

    /**
     * Get function. Only meant to be used through the other get functions in this component.
     *
     * @private
     *
     * @param {Object} object - Object to search.
     * @param {...string} option - String key to search for.
     *
     * @returns {*}
     */
    get(object, ...option) {
      let [item] = option;

      if (isPlainObject(item)) {
        item = option.name;

        if (option.key) {
          item = `${option.key}.${option.name}`;
        }
      } else {
        item = option.join('.');
      }

      if (!objectHas(object, item)) {
        return;
      }

      return objectGet(object, item);
    },

    /**
     * Update a setting value in the user settings and emit events.
     *
     * @param {Object} obj - Data.
     * @param {string} obj.name - Name.
     * @param {string} obj.value - Value.
     * @param {boolean} sort - Sorts object siblings when setting new value.
     */
    update({ name, value }, sort = false) {
      let mutableValue = value;

      if (Array.isArray(mutableValue)) {
        mutableValue = mutableValue.sort();
      }

      objectSet(this.settings, name, mutableValue);

      if (sort && typeof mutableValue !== 'object') {
        sortObjectSiblings(this.settings, name);
      }

      this.$emit(`updated:${name}`, mutableValue);
      this.$emit('updated_settings', this.settings);
    },

    /**
     * Change the platform. Emits an event for other components to listen to. Does nothing if the platform didn't
     *  actually change.
     *
     * @param {MyParcel.Platform} platform - New platform.
     */
    setPlatform(platform) {
      if (isEqual(platform, this.platform)) {
        return;
      }

      this.platform = platform;
      this.$emit('updated:platform', platform);
    },

    /**
     * @param {MyParcel.Platform} platform
     * @returns {Object}
     */
    getPlatformSettings(platform = this.platform) {
      return this.settings[platform];
    },
  },
});
