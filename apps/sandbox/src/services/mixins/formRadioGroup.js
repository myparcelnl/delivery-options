import { formCheckboxGroup } from '../../delivery-options/src/sandbox/services/mixins/formCheckboxGroup';
import { hasOptions } from '../../delivery-options/src/sandbox/services/mixins/hasOptions';

export const formRadioGroup = {
  mixins: [
    hasOptions,
    formCheckboxGroup,
  ],
};
