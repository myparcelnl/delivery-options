import {PICKUP_LOCATION} from '@myparcel-do/shared';
import {createPickupChoices} from './createPickupChoices';

/**
 * Create the pickup options array.
 *
 * @returns {Promise.<MyParcelDeliveryOptions.FormEntry[]>}
 */
export const createPickupOptions = async () => [
  {
    name: PICKUP_LOCATION,
    type: 'radio',
    component: Pickup,
    choices: await createPickupChoices(),
    loop: false,
  },
];
