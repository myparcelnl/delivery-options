/* eslint-disable no-continue */
import { ERROR_INVALID_POSTAL_CODE } from '@/config/errorConfig';
import { getNextDeliveryOption } from './delivery-options/getNextDeliveryOption';

/**
 * Generate an array of delivery options much like the actual API response.
 *
 * @param {MyParcelDeliveryOptions.DeliveryOptionsRequestParameters} args
 *
 * @returns {Object[]}
 */
export const deliveryOptionsResponseDefault = (args) => {
  const resolvedArgs = {
    ...args,
    deliverydays_window: Number(args.deliverydays_window ?? 1),
    dropoff_delay: Number(args.dropoff_delay ?? 0),
    dropoff_days: args.dropoff_days
      ? args.dropoff_days.split(';').map(Number)
      : [0, 1, 2, 3, 4, 5, 6],
  };

  const deliveryDaysWindow = resolvedArgs.deliverydays_window;
  const dropOffDelay = resolvedArgs.dropoff_delay;
  let startIndex = Number(dropOffDelay);

  return Array
    .from({ length: dropOffDelay + deliveryDaysWindow })
    .map(() => {
      const {
        index,
        data,
      } = getNextDeliveryOption(resolvedArgs, startIndex);

      // Increment the startIndex for the next run, to start from the last delivery option.
      startIndex += (index - startIndex) + 1;
      return data;
    });
};

export const deliveryOptionsResponseInvalidPostalCode = () => {
  throw {
    errors: [
      {
        code: ERROR_INVALID_POSTAL_CODE,
        message: 'Invalid postal code',
      },
    ],
  };
};

export const fakeDeliveryOptionsResponse = jest.fn(deliveryOptionsResponseDefault);
