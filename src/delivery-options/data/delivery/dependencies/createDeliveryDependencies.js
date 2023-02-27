import { DELIVERY_DATE, DELIVERY_MOMENT } from '@/config/formConfig';
import { createIsoString } from '@/delivery-options/data/dates/createIsoString';
import { formatDeliveryMoment } from '@/delivery-options/data/delivery/dependencies/formatDeliveryMoment';
import { hasSameDayDelivery } from '@/helpers/delivery/hasSameDayDelivery';
import { setSameDayDelivery } from '@/delivery-options/data/delivery/dependencies/setSameDayDelivery';

/**
 * Create the dependencies object for delivery options.
 *
 * @param {MyParcelDeliveryOptions.DeliveryOption[]} deliveryOptions - Delivery options object.
 *
 * @returns {MyParcelDeliveryOptions.DeliveryDependencies}
 */
export const createDeliveryDependencies = (deliveryOptions) => ({
  [DELIVERY_DATE]: deliveryOptions.reduce((deliveryDates, option, index) => {

    return {
      ...deliveryDates,
      [createIsoString(option.date.date)]: {
        [DELIVERY_MOMENT]: formatDeliveryMoment(option),
      },
    };
  }, {}),
});
