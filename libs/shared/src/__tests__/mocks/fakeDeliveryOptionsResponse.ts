/* eslint-disable no-continue */

import {type EndpointParameters, type EndpointResponse, type GetDeliveryOptions} from '@myparcel/sdk';
import {type FakeDeliveryOptionsParameters} from '../types';
import {type CarrierIdentifier, type SupportedPlatformName} from '../../types';
import {getNextDeliveryOption} from './delivery-options/getNextDeliveryOption';

/**
 * Generate an array of delivery options much like the actual API response.
 */
export const fakeDeliveryOptionsResponse = (
  args: EndpointParameters<GetDeliveryOptions>,
): EndpointResponse<GetDeliveryOptions> => {
  const resolvedArgs: FakeDeliveryOptionsParameters = {
    carrier: args.carrier as CarrierIdentifier,
    cutoffTime: args.cutoff_time ?? '16:00',
    deliveryDaysWindow: Number(args.deliverydays_window ?? 1),
    dropOffDays: args.dropoff_days ? args.dropoff_days.split(';').map(Number) : [0, 1, 2, 3, 4, 5, 6],
    dropOffDelay: Number(args.dropoff_delay ?? 0),
    mondayDelivery: args.monday_delivery === undefined ? undefined : Boolean(args.monday_delivery),
    platform: args.platform as SupportedPlatformName,
    saturdayDelivery: args.monday_delivery === undefined ? undefined : Boolean(args.saturday_delivery),
  };

  const {deliveryDaysWindow, dropOffDelay} = resolvedArgs;

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
        code: 3505,
        message: 'Invalid postal code',
      },
    ],
  };
};
