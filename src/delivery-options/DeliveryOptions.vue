<template>
  <form
    v-if="showDeliveryOptions"
    v-show="fakeShowDeliveryOptions"
    :class="$classBase"
    @submit.prevent="">
    <Modal
      v-if="$configBus.showModal"
      :modal-data="modalData"
      :has-close-button="$configBus.modalData.hasCloseButton"
      :component="$configBus.modalData.component" />

    <div v-show="!$configBus.showModal">
      <h3
        v-if="!loading && $configBus.strings.headerDeliveryOptions"
        v-text="$configBus.strings.headerDeliveryOptions" />

      <Loader
        v-if="loading"
        v-test="'loader'" />

      <recursive-form
        v-for="option in form.options"
        v-else
        :key="option.name"
        v-test="option.name"
        :option="option" />
    </div>
  </form>
</template>

<script>
import * as EVENTS from '@/config/eventConfig';
import * as FORM from '@/config/formConfig';
import { ERROR_INVALID_POSTAL_CODE, FATAL_ERRORS } from '@/config/errorConfig';
import Errors from '@/delivery-options/components/Errors';
import Loader from '@/delivery-options/components/Loader';
import Modal from '@/delivery-options/components/Modal';
import { addressRequirements } from '@/config/localeConfig';
import { configBus } from '@/delivery-options/config/configBus';
import { countryCodes } from '@/data/keys/countryCodes';
import debounce from 'lodash-es/debounce';
import { fetchAllCarriers } from '@/delivery-options/data/carriers/fetchAllCarriers';
import { getAddress } from '@/delivery-options/config/getAddress';
import { getDeliveryOptions } from '@/delivery-options/data/delivery/getDeliveryOptions';
import { getPickupLocations } from '@/delivery-options/data/pickup/getPickupLocations';
import isEqual from 'lodash-es/isEqual';

const DEBOUNCE_DELAY = 300;

export default {
  name: 'DeliveryOptions',
  components: {
    Modal,
    Loader,
  },
  data() {
    return {
      configBus,

      /**
       * Whether to show the delivery options module at all or not.
       *
       * @type {Boolean}
       */
      showDeliveryOptions: false,

      /**
       * "fake" version of showDeliveryOptions, only hides the module visually by using v-show instead of v-if.
       *
       * Used while hiding the delivery options to disappear instantly but allow the module to clean up and send events
       *  before actually removing itself.
       *
       * @type {Boolean}
       */
      fakeShowDeliveryOptions: true,

      /**
       * Whether the delivery options are loading or not.
       *
       * @type {Boolean}
       */
      loading: true,

      /**
       * The form object which will be filled with all delivery options fields and options.
       *
       * @type {Object}
       */
      form: {},

      /**
       * The object that will be converted to a JSON string and put in `#mypa-input`.
       *
       * @type {String}
       */
      externalData: null,

      /**
       * Event listeners object. Stored here so we can add and remove them easily.
       */
      listeners: {
        removeData: this.removeData,
        show: () => {
          if (this.showDeliveryOptions === true) {
            return;
          }

          this.showSelf();
          document.addEventListener(EVENTS.UPDATE_DELIVERY_OPTIONS, this.listeners.update);
          this.listeners.update();
        },
        hide: () => {
          this.fakeHideSelf();

          const onLastUpdate = () => {
            this.hideSelf();
            document.removeEventListener(EVENTS.UPDATE_DELIVERY_OPTIONS, this.listeners.update);
            document.removeEventListener(EVENTS.UPDATED_DELIVERY_OPTIONS, onLastUpdate);

            clearTimeout(lastUpdateTimeout);
            this.removeData();
          };

          const LAST_UPDATE_CUTOFF = 500;
          const lastUpdateTimeout = setTimeout(onLastUpdate, LAST_UPDATE_CUTOFF);
          document.addEventListener(EVENTS.UPDATED_DELIVERY_OPTIONS, onLastUpdate);
        },
        update: debounce(this.getDeliveryOptions, DEBOUNCE_DELAY),
        updateExternal: debounce(this.updateExternal, DEBOUNCE_DELAY),
      },
    };
  },

  computed: {
    /**
     * False if:
     *  - CC is undefined
     *  - Not all properties in addressRequirements for the current CC are present.
     *
     * Otherwise returns true.
     *
     * @returns {Boolean}
     */
    hasValidAddress() {
      if (!this.$configBus.address || !this.$configBus.address.cc) {
        return false;
      }

      const { cc } = this.$configBus.address;
      const countryCode = addressRequirements.hasOwnProperty(cc) ? cc : countryCodes.NETHERLANDS;
      const requirements = addressRequirements[countryCode];

      const meetsRequirements = (item) => {
        return this.$configBus.address.hasOwnProperty(item) && this.$configBus.address[item];
      };

      // False if any requirements are not met, true otherwise.
      const valid = requirements.every(meetsRequirements);

      // If invalid, tell the configBus which fields are missing.
      if (!valid) {
        this.$configBus.addError(
          // Add the invalid fields to errors
          requirements.reduce((acc, item) => {
            return meetsRequirements(item)
              ? acc
              : [
                ...acc,
                {
                  code: ERROR_INVALID_POSTAL_CODE,
                  type: 'address',
                  error: item,
                },
              ];
          }, []),
        );
      }

      return valid;
    },

    /**
     * Check if the cc in the given address allows delivery options and if any top level setting is enabled.
     *
     * @returns {Boolean}
     */
    hasSomethingToShow() {
      const { isEnabledInAnyCarrier } = this.$configBus;

      return isEnabledInAnyCarrier(FORM.formConfigPickup) || isEnabledInAnyCarrier(FORM.formConfigDelivery);
    },

    /**
     * Return modalData without component.
     *
     * @returns {Object}
     */
    modalData() {
      const { component, hasCloseButton, ...data } = this.$configBus.modalData;

      return data;
    },
  },

  created() {
    this.listeners.update();
    document.addEventListener(EVENTS.UPDATE_DELIVERY_OPTIONS, this.listeners.update);

    document.addEventListener(EVENTS.DISABLE_DELIVERY_OPTIONS, this.listeners.removeData);
    document.addEventListener(EVENTS.SHOW_DELIVERY_OPTIONS, this.listeners.show);
    document.addEventListener(EVENTS.HIDE_DELIVERY_OPTIONS, this.listeners.hide);

    // Add the new data to the values object
    this.$configBus.$on(EVENTS.UPDATE, this.$configBus.updateExternalData);

    // Debounce trigger updating the checkout
    this.$configBus.$on(EVENTS.UPDATE, this.listeners.updateExternal);

    this.$configBus.$on(EVENTS.ERROR, this.handleError);
  },

  beforeDestroy() {
    document.removeEventListener(EVENTS.UPDATE_DELIVERY_OPTIONS, this.listeners.update);

    document.removeEventListener(EVENTS.SHOW_DELIVERY_OPTIONS, this.listeners.show);
    document.removeEventListener(EVENTS.HIDE_DELIVERY_OPTIONS, this.listeners.hide);
    this.$configBus.$off(EVENTS.UPDATE, this.$configBus.updateExternalData);
    this.$configBus.$off(EVENTS.UPDATE, this.listeners.updateExternal);
    this.$configBus.$off(EVENTS.ERROR, this.handleError);
  },

  methods: {
    /**
     * Create the checkout form.
     */
    createForm() {
      // Map form entries to functions to retrieve their content.
      const map = {
        [FORM.DELIVERY]: getDeliveryOptions,
        [FORM.PICKUP]: getPickupLocations,
      };

      // Filter the choices checking if any of the given carriers have any above setting enabled. Also checks if the
      //  Carrier is allowed to have the above options in the current country.
      const choices = Object.keys(map).reduce((acc, setting) => {
        const formData = map[setting]();

        if (!formData) {
          return acc;
        }

        const configItem = FORM.formConfig.find((config) => config.name === setting);

        return this.$configBus.isEnabledInAnyCarrier(configItem) ? [...acc, formData] : acc;
      }, []);

      // Hide the checkout if there are no choices.
      if (!choices.length) {
        this.hideSelf();
        return;
      }

      this.form = {
        options: [
          {
            name: FORM.DELIVERY,
            type: 'radio',
            choices,
          },
        ],
      };
    },

    /**
     * Show the delivery options, getting all necessary data in the process.
     *
     * @param {CustomEvent|Event} event - Address.
     *
     * @returns {Promise}
     */
    async getDeliveryOptions(event) {
      /**
       * Get the address from the CustomEvent if that is how this function was called and there is an address present.
       * Use the window object otherwise.
       */
      const newAddress = getAddress(event && event.detail ? event.detail.address : null);

      const isRenderEvent = configBus.eventCallee && configBus.eventCallee.startsWith(EVENTS.RENDER_DELIVERY_OPTIONS);
      const addressChanged = isEqual(this.$configBus.address, newAddress);

      /**
       * Return if address didn't change, but only if the delivery options are already showing.
       */
      if (isRenderEvent && this.showDeliveryOptions && addressChanged) {
        return;
      }

      // Update the address in the config bus
      this.$configBus.address = newAddress;

      // Don't start loading if there's nothing to load, and hide if needed.
      if (!this.hasSomethingToShow) {
        this.hideSelf();
        return;
      }

      // Close any modal in case the update was triggered by the retry modal.
      this.$configBus.showModal = false;
      this.showSelf();

      if (!this.hasValidAddress) {
        this.showAddressErrors();
        return;
      }

      this.$configBus.showModal = false;
      this.$configBus.modalData = {};

      if (!this.$configBus.carrierData.length || addressChanged) {
        this.loading = true;
        await fetchAllCarriers();
      }

      this.$configBus.setAdvancedCarrierData();

      this.createForm();
      this.loading = false;
    },

    /**
     * Trigger an update on the checkout. Throttled to avoid overloading the external platform with updates.
     *
     * @param {Object|Boolean} data - If data is false, sends empty update.
     * @param {String} data.name - Name of the changed option (if called through update).
     * @param {*} data.value - New value of the changed option (if called through update).
     */
    updateExternal(data) {
      const { exportValues } = this.$configBus;
      const hasExportValues = exportValues && exportValues.isComplete();
      const isEmptied = data === false || (data.name === FORM.DELIVERY && data.value === null);

      if (!isEmptied && !hasExportValues) {
        return;
      }

      /*
       * Send a CustomEvent with the values as data.
       */
      document.dispatchEvent(new CustomEvent(
        EVENTS.UPDATED_DELIVERY_OPTIONS,
        {
          detail: isEmptied ? null : exportValues.toObject(),
        },
      ));
    },

    /**
     * Handle incoming errors from the configBus. Hide on "fatal" errors and show the address error modal otherwise.
     *
     * @param {Object} e - Error object.
     */
    handleError(e) {
      if (FATAL_ERRORS.includes(e.code) || e.type === 'fatal') {
        this.hideSelf();
      }

      this.showAddressErrors();
    },

    /**
     * Show the modal with the Errors component.
     */
    showAddressErrors() {
      this.loading = false;
      this.$configBus.showModal = true;
      this.$configBus.modalData = {
        component: Errors,
      };
    },

    /**
     * Empty the export values and force sending an update with the empty data.
     */
    removeData() {
      this.$configBus.exportValues = null;
      this.updateExternal(false);
    },

    /**
     * Fake hide the delivery options. See comment at below property for more details.
     *
     * @see this.fakeShowDeliveryOptions
     */
    fakeHideSelf() {
      this.fakeShowDeliveryOptions = false;
    },

    /**
     * Hide the delivery options.
     */
    hideSelf() {
      this.showDeliveryOptions = false;
    },

    /**
     * Show the delivery options.
     */
    showSelf() {
      this.showDeliveryOptions = true;
      this.fakeShowDeliveryOptions = true;
    },
  },
};
</script>
