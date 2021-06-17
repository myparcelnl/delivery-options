import { MONDAY, SATURDAY, SUNDAY } from '@/config/extraDeliveryConfig';
import { MYPARCEL, SENDMYPARCEL } from '@/data/keys/platformKeys';
import { cutoffTimeHasPassed } from '@Mocks/@myparcel/js-sdk/dist/data/delivery-options/cutoffTimeHasPassed';
import { dayjs } from '@Tests/dayjs';
import { findExtraDelivery } from '@Mocks/@myparcel/js-sdk/dist/data/delivery-options/findExtraDelivery';
import { getDeliveryOptionsEntry } from './getDeliveryOptionsEntry';
import { getDropOffDay } from '@Mocks/@myparcel/js-sdk/dist/data/delivery-options/getDropOffDay';

const daysWithoutDelivery = {
  [MYPARCEL]: [MONDAY, SUNDAY],
  [SENDMYPARCEL]: [SATURDAY, SUNDAY],
};

/**
 * Returns the next available delivery date, very much like the actual responses from the API. This needs to be
 * quite precise because we can't mock the current date with real api responses.
 *
 * @param {Object} args
 * @param {Number} daysOffset
 * @param {import('dayjs').Dayjs} date
 *
 * @returns {Object}
 */
export function getNextDeliveryOption(args, daysOffset = 1, date = dayjs()) {
  const next = () => getNextDeliveryOption(args, daysOffset + 1, date);

  const currentDeliveryDate = date.add(daysOffset, 'day');
  const dropOffDay = getDropOffDay(currentDeliveryDate, args.dropoff_days);
  const currentDayOfWeek = currentDeliveryDate.weekday();
  const todayIsDisallowed = daysWithoutDelivery[args.platform].includes(currentDayOfWeek);
  const extraDelivery = findExtraDelivery(args, currentDayOfWeek);

  // Skip Saturday or Monday if its setting is not enabled.
  if (extraDelivery) {
    const extraDeliveryEnabled = args[`${args.platform === MYPARCEL ? 'monday' : 'saturday'}_delivery`] === 1;
    const isExtraDropOffDay = dropOffDay.weekday() === extraDelivery.dropOffDay;

    if (!extraDeliveryEnabled || !isExtraDropOffDay) {
      return next();
    }
  } else if (todayIsDisallowed) {
    return next();
  }

  // If today is the dropoff day, check if the cutoff time has passed.
  if (date.isSame(dropOffDay) && cutoffTimeHasPassed(args.cutoff_time, date)) {
    return next();
  }

  return {
    index: daysOffset,
    data: getDeliveryOptionsEntry(currentDeliveryDate, !!extraDelivery),
  };
}
