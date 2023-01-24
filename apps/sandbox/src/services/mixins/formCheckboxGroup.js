import { formCheckbox } from '../../delivery-options/src/sandbox/services/mixins/formCheckbox';
import { hasOptions } from '../../delivery-options/src/sandbox/services/mixins/hasOptions';

export const formCheckboxGroup = {
  mixins: [
    formCheckbox,
    hasOptions,
  ],
};
