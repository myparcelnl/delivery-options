import {vModelMixin} from './vModel';
import {hasOptions} from './hasOptions';
import {formInputProps} from './formInputProps';

export const formSelect = {
  extends: BFormSelect,

  mixins: [vModelMixin, formInputProps, hasOptions],

  props: {
    multiple: {
      type: Boolean,
    },
  },
};
