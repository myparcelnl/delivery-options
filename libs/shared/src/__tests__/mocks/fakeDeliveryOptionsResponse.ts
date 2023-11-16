/* eslint-disable no-continue */

import {type EndpointParameters, type EndpointResponse, type GetDeliveryOptions} from '@myparcel/sdk';
import {ERROR_INVALID_POSTAL_CODE} from '../../legacy';
import {getNextDeliveryOption} from './delivery-options/getNextDeliveryOption';

/**
 * Generate an array of delivery options much like the actual API response.
 */
export const fakeDeliveryOptionsResponse = <E extends GetDeliveryOptions>(
  args: EndpointParameters<E>,
): EndpointResponse<E> => {
  const resolvedArgs = {
    ...args,
    deliverydays_window: Number(args.deliverydays_window ?? 1),
    dropoff_delay: Number(args.dropoff_delay ?? 0),
    dropoff_days: args.dropoff_days ? args.dropoff_days.split(';').map(Number) : [0, 1, 2, 3, 4, 5, 6],
  };

  const deliveryDaysWindow = resolvedArgs.deliverydays_window;
  const dropOffDelay = resolvedArgs.dropoff_delay;

  let startIndex = Number(dropOffDelay);

  return Array.from({length: dropOffDelay + deliveryDaysWindow}).map(() => {
    const {index, data} = getNextDeliveryOption(resolvedArgs, startIndex);

    // Increment the startIndex for the next run, to start from the last delivery option.
    startIndex += index - startIndex + 1;

    return data;
  });
};

export const deliveryOptionsResponseInvalidPostalCode = (): void => {
  throw {
    errors: [
      {
        code: ERROR_INVALID_POSTAL_CODE,
        message: 'Invalid postal code',
      },
    ],
  };
};
