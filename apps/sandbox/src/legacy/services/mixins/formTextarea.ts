import {vModelMixin} from './vModel';
import {formInputProps} from './formInputProps';

export const formTextarea = {
  extends: BFormTextarea,

  mixins: [vModelMixin, formInputProps],
};
