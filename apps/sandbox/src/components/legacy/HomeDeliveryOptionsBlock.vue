<template>
  <BCard
    :class="{'delivery-options--loading': loading}"
    class="delivery-options my-3 p-2">
    <form>
      <div v-html="deliveryOptionsDiv" />
    </form>
  </BCard>
</template>

<script lang="ts">
import debounce from '@myparcel-do/shared/src/__tests__/legacy/__mocks__/lodash-es/debounce.js';
import {sandboxConfigBus} from '../sandboxConfigBus.js';

export default {
  name: 'HomeDeliveryOptionsBlock',

  data() {
    const UPDATE_DELAY = 500;

    return {
      listeners: {
        update: debounce(this.updateDeliveryOptions, UPDATE_DELAY),
        render: debounce(this.renderDeliveryOptions, UPDATE_DELAY),
        startLoading: () => {
          this.loading = true;
        },

        stopLoading: () => {
          this.loading = false;
        },

        loadAndRender: () => {
          this.listeners.startLoading();

          return this.listeners.render();
        },

        loadAndUpdate: () => {
          this.listeners.startLoading();

          return this.listeners.update();
        },
      },

      loadedDeliveryOptions: false,
      loading: true,
      settings: null,
      deliveryOptionsDiv: null,
    };
  },

  computed: {
    eventDetail() {
      return {
        ...this.settings,
        selector: `.${this.$classBase}`,
      };
    },
  },

  async created() {
    this.createDeliveryOptionsDiv();

    sandboxConfigBus.$on('updated:platform', this.listeners.loadAndRender);
    sandboxConfigBus.$on('updated_settings', this.listeners.loadAndUpdate);

    await this.loadDeliveryOptionsModule();

    this.updateDeliveryOptions();

    document.addEventListener(EVENTS.UPDATED_ADDRESS, this.listeners.stopLoading);
    document.addEventListener(EVENTS.UPDATED_DELIVERY_OPTIONS, this.listeners.stopLoading);
  },

  beforeUnmount() {
    sandboxConfigBus.$off('updated:platform');
    sandboxConfigBus.$off('updated_settings');

    document.removeEventListener(EVENTS.UPDATED_ADDRESS, this.listeners.stopLoading);
    document.removeEventListener(EVENTS.UPDATED_DELIVERY_OPTIONS, this.listeners.stopLoading);
  },

  methods: {
    createDeliveryOptionsDiv() {
      this.deliveryOptionsDiv = `<div class="${this.$classBase}" />`;
    },

    updateSettings() {
      this.oldSettings = this.settings ? cloneDeep(this.settings) : {};
      this.settings = sandboxConfigBus.getPlatformSettings();

      window.MyParcelConfig = this.settings;
    },

    updateDeliveryOptions() {
      this.updateSettings();

      const configOrStringsChanged = [KEY_CONFIG, KEY_STRINGS].some((key) => {
        return isEqual(this.oldSettings[key], this.settings[key]);
      });

      // If config and strings didn't change it means only the address changed. Just send an update event in this case.
      if (!configOrStringsChanged) {
        this.dispatchEvent(EVENTS.UPDATE_DELIVERY_OPTIONS, this.eventDetail);
        return;
      }

      // Otherwise send the update config event.
      this.dispatchEvent(EVENTS.UPDATE_CONFIG_IN, this.eventDetail);
    },

    /**
     * Refreshes the delivery options html content, updates settings and tells the delivery options to rerender.
     */
    renderDeliveryOptions() {
      this.createDeliveryOptionsDiv();

      this.updateSettings();
      this.dispatchEvent(`${EVENTS.RENDER_DELIVERY_OPTIONS}@v2`, this.eventDetail);
    },

    /**
     * Dispatch an event.
     *
     * @param {string} event - Event to send.
     * @param {*} data - Any data to put in the detail property. Event will be a CustomEvent if this is used.
     */
    dispatchEvent(event, data = null) {
      if (data) {
        document.dispatchEvent(new CustomEvent(event, {detail: data}));

        return;
      }

      document.dispatchEvent(new Event(event));
    },

    /**
     * Load the dev version on dev environment, but use the compiled file on build to avoid double build size.
     *
     * @returns {Promise<void>}
     */
    async loadDeliveryOptionsModule() {
      if (this.loadedDeliveryOptions) {
        return;
      }

      // if (process.env.NODE_ENV === 'development') {
      // await import('@/delivery-options/main');
      // } else {
      // await createScript('/delivery-options/myparcel.lib.js');
      // }

      this.loadedDeliveryOptions = true;
    },
  },
};
</script>
