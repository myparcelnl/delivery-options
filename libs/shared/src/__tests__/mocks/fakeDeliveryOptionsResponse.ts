/* eslint-disable no-continue */

import {type EndpointParameters, type EndpointResponse, type GetDeliveryOptions} from '@myparcel-dev/sdk';
import {type ResolvedMockDeliveryOptionsParameters} from '../types';
import {type CarrierIdentifier, type SupportedPlatformName, type Weekday} from '../../types';
import {getNextDeliveryOption} from './delivery-options';

/**
 * Generate an array of delivery options much like the actual API response.
 */
export const fakeDeliveryOptionsResponse = async (
  args: EndpointParameters<GetDeliveryOptions>,
): Promise<EndpointResponse<GetDeliveryOptions>> => {
  const resolvedArgs: ResolvedMockDeliveryOptionsParameters = {
    carrier: args.carrier as CarrierIdentifier,
    cutoffTime: args.cutoff_time ?? '16:00',
    deliveryDaysWindow: Number(args.deliverydays_window ?? 1),
    dropOffDays: (args.dropoff_days ? args.dropoff_days.split(';').map(Number) : [0, 1, 2, 3, 4, 5, 6]) as Weekday[],
    dropOffDelay: Number(args.dropoff_delay ?? 0),
    platform: args.platform as SupportedPlatformName,
    mondayDelivery: Boolean(args.monday_delivery),
    saturdayDelivery: Boolean(args.saturday_delivery),
  };

  const {deliveryDaysWindow, dropOffDelay} = resolvedArgs;

  let startIndex = Number(dropOffDelay);

  const promises = Array.from({length: dropOffDelay + deliveryDaysWindow}).map(async () => {
    const {index, data} = await getNextDeliveryOption(resolvedArgs, startIndex);

    // Increment the startIndex for the next run, to start from the last delivery option.
    startIndex += index - startIndex + 1;

    return data;
  });

  return Promise.all(promises);
};
