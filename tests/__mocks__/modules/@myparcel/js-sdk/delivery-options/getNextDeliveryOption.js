import { MYPARCEL, SENDMYPARCEL } from '@/data/keys/platformKeys';
import { dayjs } from '@Tests/dayjs';
import { extraDeliveryConfig } from '@/config/extraDeliveryConfig';
import { getDeliveryOptionsEntry } from '@Mocks/modules/@myparcel/js-sdk/delivery-options/getDeliveryOptionsEntry';

const disallowedDays = {
  [MYPARCEL]: [0, 1],
  [SENDMYPARCEL]: [0, 6],
};

/**
 * Returns the next available delivery date, very much like the actual responses from the API. This needs to be
 *  quite precise because we can't mock the current date with real api responses.
 *
 * @param {Object} args
 * @param {Number} daysOffset
 *
 * @returns {Object}
 */
export function getNextDeliveryOption(args, daysOffset = 1) {
  const next = () => getNextDeliveryOption(args, daysOffset + 1);

  const today = dayjs().add(daysOffset, 'day');
  const dayOfWeek = today.weekday();
  const todayIsDisallowed = disallowedDays[args.platform].includes(dayOfWeek);

  let dropOffDay = dayOfWeek - 1;

  const extraDelivery = extraDeliveryConfig.find((config) => {
    const isToday = config.deliveryDay === dayOfWeek;
    const allowedInPlatform = config.platforms.includes(args.platform);

    return isToday && allowedInPlatform;
  });

  if (extraDelivery) {
    // Skip Saturday or Monday if its setting is not enabled.
    if (args[`${args.platform === MYPARCEL ? 'monday' : 'saturday'}_delivery`] !== 1) {
      return next();
    }

    // With Monday delivery, for example, the dropoff day is Saturday instead of Sunday.
    dropOffDay = extraDelivery.dropOffDay;
  } else if (todayIsDisallowed) {
    return next();
  }

  const dropOffDays = args.dropoff_days.split(';');

  // If the drop off day for today is not enabled, skip.
  if (!dropOffDays.includes(dropOffDay.toString())) {
    return next();
  }

  return {
    index: daysOffset,
    data: getDeliveryOptionsEntry(today, !!extraDelivery),
  };
}
