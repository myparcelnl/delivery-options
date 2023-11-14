import {hasOptions} from './hasOptions';
import {formCheckbox} from './formCheckbox';

export const formCheckboxGroup = {
  mixins: [formCheckbox, hasOptions],
};
