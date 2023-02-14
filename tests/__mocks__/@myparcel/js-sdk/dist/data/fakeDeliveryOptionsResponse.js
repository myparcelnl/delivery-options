/* eslint-disable no-continue */
import { ERROR_INVALID_POSTAL_CODE } from '@/config/errorConfig';
import { getNextDeliveryOption } from './delivery-options/getNextDeliveryOption';

export const fakeDeliveryOptionsResponse = jest.fn();

/**
 * Generate an array of delivery options much like the actual API response.
 *
 * @param {MyParcelDeliveryOptions.DeliveryOptionsRequestParameters} args
 *
 * @returns {Object[]}
 */
export const deliveryOptionsResponseDefault = (args) => {
  args.deliverydays_window = args.deliverydays_window ?? 1;
  args.dropoff_delay = args.dropoff_delay ?? 0;
  args.dropoff_days = args.dropoff_days ?? [0, 1, 2, 3, 4, 5, 6];

  const deliveryDaysWindow = args.deliverydays_window;
  const dropOffDelay = args.dropoff_delay;
  let startIndex = dropOffDelay;

  return Array
    .from({ length: dropOffDelay + deliveryDaysWindow })
    .map(() => {
      const { index, data } = getNextDeliveryOption(args, startIndex);
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

fakeDeliveryOptionsResponse.mockImplementation(deliveryOptionsResponseDefault);
