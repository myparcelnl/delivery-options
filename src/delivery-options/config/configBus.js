/* eslint-disable max-lines-per-function */
import * as CONFIG from '@/data/keys/configKeys';
import * as EVENTS from '@/config/eventConfig';
import * as FORM from '@/config/formConfig';
import { CarrierConfigurationFactory } from '@/data/carriers/carrierConfigurationFactory';
import { DeliveryExportValues } from '@/delivery-options/config/exports/DeliveryExportValues';
import { PickupExportValues } from '@/delivery-options/config/exports/PickupExportValues';
import Vue from 'vue';
import { carrierCanOnlyHaveSameDayDelivery } from '@/delivery-options/data/request/carrierCanOnlyHaveSameDayDelivery';
import debounce from 'lodash-es/debounce';
import { getConfig } from '@/delivery-options/config/getConfig';
import { getWeekdays } from '@/helpers/getWeekdays';
import { hasFilterableValue } from '@/delivery-options/config/hasFilterableValue';
import isObject from 'lodash-es/isObject';
import { isPastSameDayCutoffTime } from '@/delivery-options/data/request/isPastSameDayCutoffTime';
import { settingHasCarrierOverride } from '@/delivery-options/config/settingHasCarrierOverride';
import { settingHasCountryOverride } from '@/delivery-options/config/settingHasCountryOverride';

/**
 * The config bus to be used throughout the application. It's filled with `createConfigBus()`, otherwise the entire
 *  configBus will try to load before a configuration object can be provided.
 */
export let configBus;

const UPDATED_ADDRESS_DEBOUNCE_DELAY = 50;

/**
 * Creates the configBus object.
 *
 * @param {Event|CustomEvent} eventCallee - Optional event that called this function.
 *
 * @returns {configBus}
 */
export const createConfigBus = (eventCallee = null) => {
  configBus = new Vue({
    name: 'ConfigBus',

    data() {
      return {
        /**
         * Name of the last event that (re)created the configBus.
         *
         * @type {string}
         */
        eventCallee: eventCallee ? eventCallee.name : null,

        /**
         * All carrier data.
         *
         * @type {MyParcelDeliveryOptions.CarrierData[]}
         */
        carrierData: [],

        /**
         * All carrier data of carriers that have pickup locations enabled.
         *
         * @type {MyParcelDeliveryOptions.CarrierData[]}
         */
        carrierDataWithPickupLocations: [],

        /**
         * All carrier data of carriers that have delivery options enabled.
         *
         * @type {MyParcelDeliveryOptions.CarrierData[]}
         */
        carrierDataWithDeliveryOptions: [],

        /**
         * The current carrier.
         *
         * @type {MyParcel.CarrierName}
         */
        currentCarrier: null,

        /**
         * Dependency object, used for settings that depend on each other "vertically".
         *
         * Example: delivery > carrier > deliveryDate ⬅ [horizontal dependency]
         *                             | deliveryMoment
         *                             | shipmentOptions
         *                            ⬆️ [vertical dependencies that depend on siblings instead of their parent.].
         *
         * @type {MyParcelDeliveryOptions.CarrierDeliveryDependencies}
         */
        dependencies: {},

        /**
         * Object to store all pickup data in to be able to send it back to the application.
         *
         * @type {Object.<MyParcel.PickupLocation>}
         */
        pickupLocations: {},

        /**
         * Whether to show a modal or not.
         */
        showModal: false,

        /**
         * Data object to pass to modalComponent.
         *
         * @type {Object}
         */
        modalData: null,

        /**
         * Array containing any errors causing the delivery options not to show.
         *
         * @type {Array}
         */
        errors: [],

        /**
         * The object where settings will be stored.
         *
         * @type {Object}
         */
        values: {},

        /**
         * String weekdays.
         *
         * @type {string[]}
         */
        weekdays: [],

        /**
         * The object where the values that are sent to the external platform will be stored. Similar to `this.values`,
         *  but this object is tweaked to comply with our API and conventions and to maximize readability for the
         *  developers using it.
         *
         * @type {DeliveryExportValues|PickupExportValues}
         */
        exportValues: null,

        /**
         * @type {DeliveryExportValues}
         */
        deliveryExportValues: null,

        /**
         * @type {PickupExportValues}
         */
        pickupExportValues: null,

        /**
         * Must be defined before it is filled in created().
         *
         * @type {MyParcelDeliveryOptions.Configuration}
         */
        config: null,

        /**
         * Must be defined before it is filled in created().
         *
         * @type {MyParcel.Strings}
         */
        strings: null,

        /**
         * Must be defined before it is filled in created().
         *
         * @type {MyParcel.Address}
         */
        address: null,
      };
    },

    computed: {
      /**
       * Whether there are multiple carriers with delivery available or not.
       *
       * @returns {boolean}
       */
      hasMultipleDeliveryCarriers() {
        return this.carrierDataWithDeliveryOptions.length > 1;
      },

      /**
       * Whether there are multiple carriers with pickup locations or not.
       *
       * @returns {boolean}
       */
      hasMultiplePickupCarriers() {
        return this.carrierDataWithPickupLocations.length > 1;
      },
    },

    watch: {
      /**
       * When the current carrier changes update the values.
       *
       * @param {MyParcel.CarrierName} value - New carrier.
       */
      currentCarrier(value) {
        this.values[FORM.CARRIER] = value;
      },

      /**
       * Send an event when the address changes for any external code to listen to.
       */
      address: {
        handler: debounce(
          function updatedAddress() {
            document.dispatchEvent(new Event(EVENTS.UPDATED_ADDRESS));
          }, UPDATED_ADDRESS_DEBOUNCE_DELAY,
        ),

        deep: true,
      },
    },

    created() {
      // Load the configuration.
      const initialize = (event) => {
        const configFromEvent = event && event.detail ? event.detail : undefined;
        const configuration = getConfig(configFromEvent);

        /**
         * The configuration data.
         */
        Object.keys(configuration).forEach((item) => {
          this[item] = configuration[item];
        });

        this.currentCarrier = Object.keys(configuration.config.carrierSettings)[0];
        this.weekdays = getWeekdays(configuration.config.locale);

        document.dispatchEvent(new Event(EVENTS.UPDATE_DELIVERY_OPTIONS));
      };

      initialize();

      document.addEventListener(EVENTS.UPDATE_CONFIG_IN, initialize);
    },

    methods: {
      /**
       * Get the value of a given option in the config.
       *
       * ## Order of priority:
       * 1. `config.carrierData.<carrier>.<option>`        - Only if `carrier` is set!
       * 2. `config.carrierData.<currentCarrier>.<option>` - User defined carrier specific settings. Only if
       *                                                     option is not in the settingsWithCarrierOverride array.
       * 3. `config.<option>`                              - User defined default settings.
       * 4. `defaultConfig.<option>`                       - Will be in `this.config` if there are no user defined
       *                                                     default settings.
       *
       * @param {Object | string} option - Option object or name.
       * @param {string} key - Key name to use. Defaults to "name".
       * @param {MyParcel.CarrierName} carrier - Carrier name.
       *
       * @returns {any}
       */
      get(option, key = null, carrier = null) {
        carrier = carrier ?? this.currentCarrier;
        key = key ?? 'name';
        let setting;
        const optionKey = typeof option === 'string' ? option : option[key];

        const settingsByCarrier = this.getSettingsByCarrier(carrier);
        const isInCarrier = settingsByCarrier && settingsByCarrier.hasOwnProperty(optionKey);

        // If the setting can have carrier overrides array get the carrier setting instead if it exists.
        if (isInCarrier && settingHasCarrierOverride(optionKey)) {
          setting = settingsByCarrier[optionKey];
        } else {
          setting = this.config[optionKey];
        }

        return setting;
      },

      /**
       * Check if a given option is enabled in the config or not. Returns false if the option is not present in the
       *  config or if `option.enabled` is false. Only returns true if `option.enabled` is present, in the config and
       *  true.
       *
       * @param {string | MyParcelDeliveryOptions.FormConfig | Object} option - FormConfig options object.
       *
       * @param {string} key - String key to use with this.get().
       * @param {MyParcel.CarrierName} carrier - Carrier name.
       *
       * @returns {boolean}
       */
      isEnabled(option, key = null, carrier = null) {
        if (typeof option === 'string') {
          option = { enabled: option };
        }

        if (!option.hasOwnProperty('enabled')) {
          return true;
        }

        const optionValue = this.get(option, key ?? 'enabled', carrier);
        if (isObject(optionValue) && settingHasCountryOverride(option[key ?? 'enabled'])) {
          return hasFilterableValue(optionValue, this.address.cc);
        }

        return Boolean(optionValue);
      },

      /**
       * Add errors to `this.errors` under a given key.
       *
       * @param {Object} error - Error to add.
       */
      addError(error) {
        this.errors = [...this.errors, error];
        this.$emit(EVENTS.ERROR, error);
      },

      /**
       * Get the carrier specific settings for the given carrier.
       *
       * @param {MyParcel.CarrierName} carrier - Carrier name.
       *
       * @returns {Object|null}
       */
      getSettingsByCarrier(carrier = this.currentCarrier) {
        const carrierSettings = this.config[CONFIG.CARRIER_SETTINGS];

        if (!carrierSettings.hasOwnProperty(carrier)) {
          return null;
        }

        return carrierSettings[carrier];
      },

      /**
       * @param {string | MyParcelDeliveryOptions.FormConfig | Object} option
       *
       * @returns {boolean}
       */
      isEnabledInAnyCarrier(option) {
        const carrierSettings = this.get(CONFIG.CARRIER_SETTINGS);

        return Object
          .keys(carrierSettings)
          .some((carrier) => this.isEnabled(option, null, carrier));
      },

      /**
       * Get a value by name.
       *
       * @param {string} name - Name of the property to add/update.
       *
       * @returns {any}
       */
      getValue(name) {
        return this.values[name];
      },

      /**
       * @param {MyParcel.CarrierName} carrierName - Carrier name.
       *
       * @returns {Object}
       */
      getCarrierByName(carrierName) {
        return this.carrierData.find((carrier) => carrier.name === carrierName);
      },

      /**
       * Updates the configBus with the new delivery options data and communicate it to the external platform.
       *
       * @param {Object} obj - Destructured update event.
       * @param {string} obj.name - Name of the setting that was updated.
       * @param {any} obj.value - Setting value.
       */
      updateExternalData({ name, value }) {
        this.values[name] = value;
        this.updateCurrentCarrier({ name, value });

        let values;
        switch (this.getValue(FORM.DELIVERY)) {
          case FORM.DELIVER:
            this.pickupExportValues = null;
            this.deliveryExportValues = this.deliveryExportValues || new DeliveryExportValues();

            this.deliveryExportValues.update(this.values);
            values = this.deliveryExportValues;
            break;
          case FORM.PICKUP:
            this.deliveryExportValues = null;
            this.pickupExportValues = this.pickupExportValues || new PickupExportValues();

            this.pickupExportValues.update(this.values);
            values = this.pickupExportValues;
            break;
        }

        this.exportValues = values;

        // Using $nextTick to emit event after this function is done.
        // @see https://forum.vuejs.org/t/do-something-after-emit-has-finished-successful/10663/10
        this.$nextTick().then(() => {
          this.$emit(EVENTS.AFTER_UPDATE, { name, value });
        });
      },

      /**
       * Update the current carrier.
       *
       * @param {Object} obj - Name/value object.
       * @param {string} obj.name - Setting that changed.
       * @param {MyParcel.CarrierName | number} obj.value - New carrier or pickup location id.
       */
      updateCurrentCarrier({ name, value }) {
        if (FORM.CARRIER === name) {
          this.currentCarrier = value;
        } else if (FORM.PICKUP_LOCATION === name) {
          const foundPickupLocation = this.pickupLocations.find((pickupLocation) => {
            return pickupLocation.location_code === value;
          });

          if (foundPickupLocation) {
            this.currentCarrier = foundPickupLocation.carrier;
          }
        }

        this.values[FORM.CARRIER] = this.currentCarrier;
      },

      /**
       * Set the advanced carrier data. This is not done when fetching carriers because this can change based on the
       *  entered address.
       */
      setAdvancedCarrierData() {
        this.carrierDataWithPickupLocations = this.carrierData.filter((carrier) => {
          const carrierConfiguration = CarrierConfigurationFactory.create(carrier.name, this.get('platform'));
          return carrier.pickupEnabled && carrierConfiguration.allowsPickupIn(this.address.cc);
        });

        this.carrierDataWithDeliveryOptions = this.carrierData.filter((carrier) => {
          const carrierConfiguration = CarrierConfigurationFactory.create(carrier.name, this.get('platform'));

          if (carrierCanOnlyHaveSameDayDelivery(carrier.name) && isPastSameDayCutoffTime(carrier.name)) {
            return false;
          }

          return carrier.deliveryEnabled && carrierConfiguration.allowsDeliveryIn(this.address.cc);
        });
      },
    },
  });

  return configBus;
};
