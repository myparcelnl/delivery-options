<template>
  <div :class="`${$classBase}__errors`">
    <h4 v-text="$configBus.strings.addressNotFound" />

    <ul>
      <li
        v-for="error in errors"
        :key="error">
        <span v-text="error" />
      </li>
    </ul>

    <button
      v-if="hasRetry"
      type="button"
      @click.prevent="retry"
      v-text="$configBus.strings.retry" />
  </div>
</template>

<script>
import * as EVENTS from '@/config/eventConfig';
import { ADDRESS_CASE_MAP } from '@/data/keys/addressKeys';
import { ERROR_MISSING_REQUIRED_PARAMETER } from '@/config/errorConfig';
import { FEATURE_ALLOW_RETRY } from '@/data/keys/configKeys';

export default {
  name: 'Errors',

  props: {
    /**
     * @type {{options: {code: number, endpoint: string, message: string, type: string}[]}}
     */
    data: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      values: {
        ...this.$configBus.address,
      },
    };
  },

  computed: {
    /**
     * Map api errors into translations and return them.
     *
     * @returns {string[]}
     */
    errors() {
      return this.data.options.map((option) => {
        let configBusString = this.$configBus.strings[`error${option.code}`];

        if (configBusString && option.code === ERROR_MISSING_REQUIRED_PARAMETER) {
          const field = (/^(\w+)\s/).exec(option.message);
          const mappedField = ADDRESS_CASE_MAP[field[1]] || field[1];

          configBusString = configBusString.replace('{}', this.$configBus.strings[mappedField] || mappedField);
        }

        return configBusString || option.message;
      });
    },

    hasRetry() {
      return this.$configBus.get(FEATURE_ALLOW_RETRY);
    },
  },

  methods: {
    /**
     * Update the address in the configBus with the new address and send it to the external platform.
     */
    retry() {
      const newAddress = { ...this.$configBus.address, ...this.values };

      // Trigger the event to make the checkout update.
      document.dispatchEvent(new CustomEvent(EVENTS.UPDATE_DELIVERY_OPTIONS, { detail: { address: newAddress } }));

      // Send the new values in an event. It's up to the external platform to do handle this event or not.
      document.dispatchEvent(new CustomEvent(EVENTS.UPDATED_ADDRESS, { detail: newAddress }));
    },
  },
};
</script>
