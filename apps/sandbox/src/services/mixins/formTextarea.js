import { BFormTextarea } from 'bootstrap-vue';
import { formInputProps } from '../../delivery-options/src/sandbox/services/mixins/formInputProps';
import { vModelMixin } from '../../delivery-options/src/sandbox/services/mixins/vModel';

export const formTextarea = {
  extends: BFormTextarea,

  mixins: [
    vModelMixin,
    formInputProps,
  ],
};
