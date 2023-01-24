import { PICKUP_LOCATION } from '../../config';
import Pickup from '../../components/Pickup/Pickup.vue';
import { createPickupChoices } from './createPickupChoices';

/**
 * Create the pickup options array.
 *
 * @returns {Promise.<MyParcelDeliveryOptions.FormEntry[]>}
 */
export const createPickupOptions = async() => [
  {
    name: PICKUP_LOCATION,
    type: 'radio',
    component: Pickup,
    choices: await createPickupChoices(),
    loop: false,
  },
];
