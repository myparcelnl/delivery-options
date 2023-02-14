import {
  PICKUP_MOMENT,
  PICKUP_STANDARD,
  formConfigPickup,
} from '@/config/formConfig';
import { configBus } from '@/delivery-options/config/configBus';
import { createLocaleString } from '@/delivery-options/data/dates/createLocaleString';

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

  if (!pickupLocation.possibilities.some((possibility) => Boolean(possibility.moment?.start?.date))) {
    return [];
  }

  return [
    {
      name: PICKUP_MOMENT,
      type: 'radio',
      choices: pickupLocation.possibilities.map((possibility) => {
        const deliveryType = possibility.delivery_type_name || PICKUP_STANDARD;
        const pickupConfig = formConfigPickup.options.find(({ name }) => name === deliveryType);

        if (!configBus.isEnabled(pickupConfig)) {
          return null;
        }

        const timestamp = possibility.moment?.start?.date;

        let pickupText = configBus.strings.pickUp;

        if (timestamp) {
          const pickupTime = possibility.moment?.start?.date ? createLocaleString(possibility.moment.start.date) : null;
          pickupText = `${configBus.strings.pickUpFrom} ${pickupTime}`;
        }

        return {
          ...pickupConfig,
          plainLabel: pickupText,
        };
      }),
    },
  ];
}
