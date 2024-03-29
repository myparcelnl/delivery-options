<template>
  <BFormRow
    :id="`row_${formItemName}`"
    class="mb-2"
    :class="{
      'text-muted': additionalProps.disabled,
    }">
    <BCol v-if="isTitle">
      <component :is="isTopLevel ? 'BCard' : 'div'">
        <Heading
          :id="formItem.title"
          :level="mutableLevel + 1">
          {{ $t(translation(formItem.title)) }}
        </Heading>
        <p>{{ $t(translation(formItem.title, 'description')) }}</p>
        <hr v-if="isTopLevel">

        <FormGroup
          v-for="setting in formItem.settings"
          :key="createUniqueId(setting.name || setting.title)"
          :prefix="formItemName"
          :form-item="setting"
          :level="mutableLevel" />
      </component>
    </BCol>

    <template v-else>
      <BCol cols="5">
        <label
          class="col-form-label col-form-label-sm d-flex flex-column flex-lg-row"
          :for="formItemName">
          <span v-t="translation(formItem.name)" />

          <span class="d-inline-flex ml-auto">
            <BBadge
              v-if="formItem.carrier"
              class="border mr-1 my-auto"
              variant="light">
              <img
                class="mx-1"
                height="16"
                :src="$getUrl.carrierLogo(formItem.carrier.name)"
                :alt="`${formItem.carrier.text} logo`">

              {{ formItem.carrier.text }}
            </BBadge>

            <Help
              v-if="translation(formItem.name, 'description')"
              triggers="hover focus"
              :target="`row_${formItemName}`">
              <!-- eslint-disable-next-line vue/no-v-html : This value never contains user input. -->
              <div v-html="$t(translation(formItem.name, 'description'))" />
            </Help>
          </span>
        </label>
      </BCol>

      <BCol
        cols="6"
        class="d-flex">
        <component :is="!!formItem.carrier ? 'BInputGroup' : 'div'">
          <component
            :is="formItem.component || 'CTextInput'"
            :id="formItemName"
            v-model.trim="mutableValue"
            autocomplete="off"
            :name="formItemName"
            v-bind="{
              ...formItem.props || {},
              ...additionalProps,
            }" />
        </component>
      </BCol>
    </template>
  </BFormRow>
</template>

<script>
import CTextInput from '@/sandbox/components/form/CTextInput';
import CarrierButton from '@/sandbox/components/CarrierButton';
import Heading from '@/sandbox/components/Heading';
import Help from '@/sandbox/components/Help';
import debounce from 'lodash-es/debounce';
import isEqual from 'lodash-es/isEqual';
import { sandboxConfigBus } from '@/sandbox/sandboxConfigBus';
import { uniqueIdMixin } from '@/sandbox/services/mixins/uniqueIdMixin';

const SET_DEBOUNCE_DELAY = 300;

export default {
  name: 'FormGroup',
  components: {
    CTextInput,
    CarrierButton,
    Heading,
    Help,
  },

  mixins: [uniqueIdMixin],

  props: {
    formItem: {
      type: Object,
      default: null,
    },

    level: {
      type: Number,
      default: 1,
    },

    prefix: {
      type: String,
      default: () => '',
    },
  },

  data() {
    return {
      listeners: {
        onCodeClick: this.onCodeClick,
      },

      conditions: new Set(),
      configBusEvents: new Set(),
      mutableAdditionalProps: null,
      value: null,
    };
  },

  computed: {
    /**
     * The full key that is used as the current form item's id. Passed down to each child element to add to it.
     *
     * @returns {string}
     */
    formItemName() {
      const { name, key } = this.formItem;
      const newKey = key ? `${key}.` : '';

      return this.prefix + newKey + (name || '');
    },

    /**
     * Mutable value of the current form item.
     */
    mutableValue: {
      get() {
        return sandboxConfigBus.getSetting(this.formItemName);
      },

      set: debounce(function debouncedSet(value) {
        if (!isEqual(value, this.mutableValue)) {
          return this.setMutableValueCallback(value);
        }
      }, SET_DEBOUNCE_DELAY),
    },

    isTopLevel() {
      return this.level === 1;
    },

    mutableLevel() {
      return this.level + 1;
    },

    isTitle() {
      return this.formItem.hasOwnProperty('title');
    },

    /**
     * Additional props to pass to the <component>. Used by conditions to modify "disabled" or other attributes.
     *
     * @type {Object}
     */
    additionalProps: {
      get() {
        if (this.mutableAdditionalProps) {
          return this.mutableAdditionalProps;
        }

        const { conditions } = this.formItem;

        if (!conditions || !conditions.length) {
          return {};
        }

        this.getAdditionalProps();

        return this.mutableAdditionalProps;
      },

      set(props) {
        this.mutableAdditionalProps = props;
      },
    },
  },

  /**
   * Set up the component by creating listeners and telling the sandboxConfigBus that the current item has been created.
   */
  created() {
    sandboxConfigBus.$on('click:code', this.listeners.onCodeClick);

    sandboxConfigBus.itemsInForm.add(this.formItemName);
    sandboxConfigBus.$emit('created:formItem', this.formItemName);
  },

  /**
   * Remove event listeners.
   */
  beforeUnmount() {
    sandboxConfigBus.$off('click:code', this.listeners.onCodeClick);

    [...this.configBusEvents].forEach((condition) => {
      sandboxConfigBus.$off(`update:${condition}`);
    });
  },

  methods: {
    /**
     * Updates value and tells the sandbox configBus about it when mutable value changes.
     * It's a separate function because it's debounced in computed.mutableValue.set().
     *
     * @param {any} value - New value of mutableValue.
     */
    setMutableValueCallback(value) {
      this.value = value;

      sandboxConfigBus.update({ name: this.formItemName, value });
    },

    /**
     * Get translation key by using the formItem name and optional added keys. Concatenates all that into a dot
     *  separated array and prefixes it with the correct translation key based on whether the current item is a title.
     *
     * Returns undefined if the created key doesn't match any translation.
     *
     * @param {string} name - Base key path.
     * @param {...string} additionalKeys - Any extra keys to add to the key path.
     *
     * @returns {undefined | string}
     */
    translation(name = this.formItem.name, ...additionalKeys) {
      const prefix = this.isTitle ? 'title' : 'field';
      const key = [prefix, name, ...additionalKeys].join('.');

      if (this.$te(key)) {
        return key;
      }
    },

    /**
     * Loop through the formItem's conditions to determine whether it should be disabled or not.
     *
     * @param {string?} trigger - Name of the condition that triggered this function.
     */
    getAdditionalProps(trigger) {
      if (typeof trigger === 'string' && this.configBusEvents.has(trigger)) {
        this.configBusEvents.delete(trigger);
      }

      const props = {};

      /**
       * Check if all conditions passed.
       */
      const passed = this.formItem.conditions.every((condition) => {
        if (Array.isArray(condition)) {
          return condition.some(this.validateCondition);
        }

        return this.validateCondition(condition);
      });

      props.disabled = !passed;

      // If the current setting is a boolean toggle set it to false.
      if (typeof this.mutableValue === 'boolean' && !passed) {
        sandboxConfigBus.update({
          name: this.formItemName,
          value: false,
        });
      }

      this.setEvents();
      this.additionalProps = props;
    },

    /**
     * Check if a condition's value is truthy by string path.
     *
     * @param {string} condition
     *
     * @returns {boolean}
     */
    validateCondition(condition) {
      if (condition.includes('.')) {
        condition = `${sandboxConfigBus.platform}.${condition}`;
      } else {
        // If there is no . in the condition, find it on the same level.
        const parts = this.formItemName.split('.');
        parts.pop();
        condition = [...parts, condition].join('.');
      }

      this.conditions.add(condition);
      return !!sandboxConfigBus.getSetting(condition);
    },

    /**
     * On code click, use the id to check if the current element was referenced. If so, focus on it and scroll it into
     *  view. Otherwise do nothing.
     *
     * @param {string} id - Id that must match this.formItemName.
     */
    onCodeClick(id) {
      if (id !== this.formItemName) {
        return;
      }

      const input = document.getElementById(id);

      if (!input) {
        return;
      }

      input.focus();
      input.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    },

    /**
     * Set an one time event for each condition to trigger getAdditionalProps again whenever it changes.
     */
    setEvents() {
      this.conditions.forEach((condition) => {
        if (this.configBusEvents.has(condition)) {
          return;
        }

        this.configBusEvents.add(condition);

        sandboxConfigBus.$once(`updated:${condition}`, () => this.getAdditionalProps(condition));
      });
    },
  },
};
</script>
