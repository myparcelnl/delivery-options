import {DELIVERY_DATE, DELIVERY_MOMENT} from '@myparcel-do/shared';
import {createIsoString} from '../../dates';
import {formatDeliveryMoment} from './formatDeliveryMoment';

/**
 * Create the dependencies object for delivery options.
 *
 * @param {MyParcelDeliveryOptions.DeliveryOption[]} deliveryOptions - Delivery options object.
 *
 * @returns {MyParcelDeliveryOptions.DeliveryDependencies}
 */
export const createDeliveryDependencies = (deliveryOptions) => ({
  [DELIVERY_DATE]: deliveryOptions.reduce((deliveryDates, option) => {
    return {
      ...deliveryDates,
      [createIsoString(option.date.date)]: {
        [DELIVERY_MOMENT]: formatDeliveryMoment(option),
      },
    };
  }, {}),
});
