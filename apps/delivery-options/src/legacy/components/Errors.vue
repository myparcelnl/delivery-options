<template>
  <div
    v-test="'errors'"
    :class="`${$classBase}__errors`">
    <h4 v-text="$configBus.strings.addressNotFound" />

    <ul
      v-if="errors.length"
      v-test="'errors__ul'">
      <li
        v-for="(error, index) in errors"
        :key="`${error.code}--${index}`"
        v-test="{
          code: error.code,
          index: index,
          id: 'errors__li',
        }">
        <span v-text="error.translation" />
      </li>
    </ul>

    <template v-if="hasRetry">
      <p
        v-for="field in requiredFields"
        :key="field.name">
        <label>
          {{ $configBus.strings[field.name] }}
          <input
            v-model="values[field.name]"
            :name="`${field.name}-input`"
            :placeholder="$configBus.strings[field.name]"
            v-bind="field.attributes"
            v-text="$configBus.strings[field.name]" />
        </label>
      </p>

      <button
        v-test="'button--retry'"
        type="button"
        @click.prevent="retry"
        v-text="$configBus.strings.retry" />
    </template>
  </div>
</template>

<script lang="ts">
import {ERROR_MISSING_REQUIRED_PARAMETER} from '@myparcel-do/shared';

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
     * @returns {{name: string, attributes: Object<string, any>}[]}
     */
    requiredFields() {
      const errors = this.mappedOptions.filter((option) => option.field).map((option) => option.field);

      const optionsFromErrors = new Set(errors);

      const [fields] = ADDRESS_FIELD_COMBINATIONS.map((combination) => ({
        combination,
        common: combination.filter((option) => optionsFromErrors.has(option)).length,
      }))
        .sort((itemA, itemB) => itemB.common - itemA.common)
        .map((item) => item.combination);

      return ADDRESS_FIELDS.filter((field) => fields.includes(field.name));
    },

    mappedOptions() {
      return this.data.options.map((option) => {
        let field = null;

        if (option.code === ERROR_MISSING_REQUIRED_PARAMETER) {
          const match = /^(\w+)\s/.exec(option.message);
          field = ADDRESS_CASE_MAP[match[1]] || match[1];
        }

        return {
          ...option,
          field,
        };
      });
    },

    /**
     * Map api errors into translations and return them.
     *
     * @returns {string[]}
     */
    errors() {
      return this.mappedOptions.map((option) => {
        let configBusString = this.$configBus.strings[`error${option.code}`];

        if (configBusString && option.code === ERROR_MISSING_REQUIRED_PARAMETER) {
          configBusString = configBusString.replace('{}', this.$configBus.strings[option.field]);
        }

        return {
          ...option,
          translation: configBusString || option.message,
        };
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
      const newAddress = {...this.$configBus.address, ...this.values};

      // Trigger the event to make the checkout update.
      document.dispatchEvent(new CustomEvent(EVENTS.UPDATE_DELIVERY_OPTIONS, {detail: {address: newAddress}}));

      // Send the new values in an event. It's up to the external platform to do handle this event or not.
      document.dispatchEvent(new CustomEvent(EVENTS.UPDATED_ADDRESS, {detail: newAddress}));
    },
  },
};
</script>
