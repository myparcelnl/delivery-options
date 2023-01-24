import { DELIVERY_DATE, DELIVERY_MOMENT } from '../../../config';
import { createIsoString } from '../../dates';
import { formatDeliveryMoment } from './formatDeliveryMoment';
import { hasSameDayDelivery } from '../../../helpers';
import { setSameDayDelivery } from './setSameDayDelivery';

/**
 * Create the dependencies object for delivery options.
 *
 * @param {MyParcelDeliveryOptions.DeliveryOption[]} deliveryOptions - Delivery options object.
 *
 * @returns {MyParcelDeliveryOptions.DeliveryDependencies}
 */
export const createDeliveryDependencies = (deliveryOptions) => ({
  [DELIVERY_DATE]: deliveryOptions.reduce((deliveryDates, option, index) => {
    if (index === 0 && hasSameDayDelivery()) {
      setSameDayDelivery(option);
    }

    return {
      ...deliveryDates,
      [createIsoString(option.date.date)]: {
        [DELIVERY_MOMENT]: formatDeliveryMoment(option),
      },
    };
  }, {}),
});
