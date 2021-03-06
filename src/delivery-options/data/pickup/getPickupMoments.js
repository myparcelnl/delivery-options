import {
  PICKUP_MOMENT,
  PICKUP_STANDARD,
  formConfigPickup,
} from '@/config/formConfig';
import { configBus } from '@/delivery-options/config/configBus';
import { createLocaleString } from '@/delivery-options/data/dates/createLocaleString';

const deliveryTypeMap = {
  pickup: PICKUP_STANDARD,
};

/**
 * Get pickup moments.
 *
 * @param {Object} pickupLocation - Pickup location to render.
 *
 * @param {Array} pickupLocation.possibilities - Possibilities array.
 * @param {Object} pickupLocation.possibilities.delivery_type_name - Possibilities array.
 *
 * @returns {MyParcelDeliveryOptions.FormEntry[]}
 */
export function getPickupMoments(pickupLocation) {
  /**
   * Sort moments by pickup time, from early to late.
   *
   * @param {Object} dateA
   * @param {MyParcel.StartEndDate} dateA.moment
   * @param {Object} dateB
   * @param {MyParcel.StartEndDate} dateB.moment
   */
  pickupLocation.possibilities.sort((dateA, dateB) => {
    return new Date(dateA.moment.start.date) - new Date(dateB.moment.start.date);
  });

  return [
    {
      name: PICKUP_MOMENT,
      type: 'radio',
      choices: pickupLocation.possibilities.map((possibility) => {
        const pickupTime = createLocaleString(possibility.moment.start.date);
        const pickupText = `${configBus.strings.pickUpFrom} ${pickupTime}`;
        const deliveryType = deliveryTypeMap[possibility.delivery_type_name];
        const pickupConfig = formConfigPickup.options.find(({ name }) => name === deliveryType);

        if (!configBus.isEnabled(pickupConfig)) {
          return null;
        }

        return {
          ...pickupConfig,
          plainLabel: pickupText,
        };
      }),
    },
  ];
}
