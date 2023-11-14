import {vModelMixin} from './vModel';
import {formInputProps} from './formInputProps';

export const formTextInput = {
  mixins: [vModelMixin, formInputProps],

  props: {
    lazy: {
      type: Boolean,
      default: true,
    },

    type: {
      type: String,
      default: 'text',
    },

    placeholder: {
      type: String,
      default: () => 'default_placeholder',
    },

    autocomplete: {
      type: String,
      default: null,
    },
  },

  computed: {
    /**
     * Translate the placeholder if possible.
     *
     * @returns {string}
     */
    placeholderValue() {
      return this.$te(this.placeholder) ? this.$t(this.placeholder) : this.placeholder;
    },

    /**
     * Replace placeholder by the translated placeholder.
     *
     * @returns {Object}
     */
    filteredProps() {
      const {placeholder, ...props} = this.$props;

      return {
        placeholder: this.placeholderValue,
        ...props,
      };
    },
  },
};
