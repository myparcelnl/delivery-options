import * as CONFIG from '@/data/keys/configKeys';
import { UPDATED_DELIVERY_OPTIONS } from '@/config/eventConfig';
import { mockDeliveryOptions } from '@Tests/unit/delivery-options/mockDeliveryOptions';
import { waitForEvent } from '@Tests/waitForEvent';

/**
 * Mock delivery options and returns the array of visible choices for the delivery date option.
 *
 * @param {Object} config
 *
 * @returns {Promise<string[]>}
 */
export async function getMockedDeliveryDateChoices(config) {
  const wrapper = mockDeliveryOptions({
    [CONFIG.KEY]: config,
  });

  await waitForEvent(UPDATED_DELIVERY_OPTIONS);

  let wrappers;
  const deliveryDateOption = wrapper.findByTestId('deliveryDate__select__label');

  // When delivery days window is 1 the only option is shown as text instead of a select option.
  if (deliveryDateOption.exists()) {
    wrappers = [deliveryDateOption];
  } else {
    wrappers = wrapper.findAllByTestId('deliveryDate__select__option').wrappers;
  }

  return wrappers.map((wrapper) => wrapper.element.getAttribute('data-test-choice'));
}
