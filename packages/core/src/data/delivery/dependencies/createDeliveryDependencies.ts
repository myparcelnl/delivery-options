import {DELIVERY_DATE, DELIVERY_MOMENT} from '../config/formConfig';
import {createIsoString} from '../delivery-options/data/dates/createIsoString';
import {formatDeliveryMoment} from '../delivery-options/data/delivery/dependencies/formatDeliveryMoment';

/**
 * Create the dependencies object for delivery options.
 *
 * @param {MyParcelDeliveryOptions.DeliveryOption[]} deliveryOptions - Delivery options object.
 *
 * @returns {MyParcelDeliveryOptions.DeliveryDependencies}
 */
export const createDeliveryDependencies = (deliveryOptions) => ({
  [DELIVERY_DATE]: deliveryOptions.reduce((deliveryDates, option) => ({
    ...deliveryDates,
    [createIsoString(option.date.date)]: {
      [DELIVERY_MOMENT]: formatDeliveryMoment(option),
    },
  }), {}),
});
