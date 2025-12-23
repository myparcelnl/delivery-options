// This mock utility has been simplified as part of vue-form-builder migration
// Form functionality is now handled directly by individual components using reactive values

import {useSelectedValues} from '../../composables';

/**
 * Mock function for backward compatibility with existing tests.
 * Returns the reactive selected values directly instead of a form instance.
 */
export const mockDeliveryOptionsForm = async () => {
  return useSelectedValues();
};
