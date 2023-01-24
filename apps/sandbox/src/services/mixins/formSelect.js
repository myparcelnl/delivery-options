import { BFormSelect } from 'bootstrap-vue/src/components/form-select/form-select';
import { formInputProps } from '../../delivery-options/src/sandbox/services/mixins/formInputProps';
import { hasOptions } from '../../delivery-options/src/sandbox/services/mixins/hasOptions';
import { vModelMixin } from '../../delivery-options/src/sandbox/services/mixins/vModel';

export const formSelect = {
  extends: BFormSelect,

  mixins: [
    vModelMixin,
    formInputProps,
    hasOptions,
  ],

  props: {
    multiple: {
      type: Boolean,
    },
  },
};
