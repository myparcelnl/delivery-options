import {hasOptions} from './hasOptions';
import {formCheckboxGroup} from './formCheckboxGroup';

export const formRadioGroup = {
  mixins: [hasOptions, formCheckboxGroup],
};
