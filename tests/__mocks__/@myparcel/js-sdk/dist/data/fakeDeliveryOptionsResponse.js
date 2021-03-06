/* eslint-disable no-continue */
import { getNextDeliveryOption } from './delivery-options/getNextDeliveryOption';

export const fakeDeliveryOptionsResponse = jest.fn();

/**
 * Generate an array of delivery options much like the actual API response.
 *
 * @param {Object} args
 * @param {String} args.package_type
 * @param {String} args.include
 * @param {MyParcel.Platform} args.platform
 * @param {String} args.carrier
 * @param {String} args.cc
 * @param {Number} args.number
 * @param {String} args.postal_code
 * @param {String} args.cutoff_time
 * @param {Number} args.deliverydays_window
 * @param {Number} args.dropoff_delay
 * @param {String} args.dropoff_days
 * @param {?Boolean} args.monday_delivery
 * @param {?Boolean} args.saturday_delivery
 *
 * @returns {Object[]}
 */
fakeDeliveryOptionsResponse.mockImplementation((args) => {
  args.deliverydays_window = args.deliverydays_window ?? 1;
  args.dropoff_delay = args.dropoff_delay ?? 0;
  args.dropoff_days = args.dropoff_days ?? [0, 1, 2, 3, 4, 5, 6];

  const deliveryDaysWindow = args.deliverydays_window;
  const dropOffDelay = args.dropoff_delay;
  let startIndex = dropOffDelay + 1;

  return Array
    .from({ length: dropOffDelay + deliveryDaysWindow })
    .map(() => {
      const { index, data } = getNextDeliveryOption(args, startIndex);
      // Increment the startIndex for the next run, to start from the last delivery option.
      startIndex += (index - startIndex) + 1;
      return data;
    });
});
