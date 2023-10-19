import { MONDAY, SATURDAY, SUNDAY } from '@/config/extraDeliveryConfig';
import { MYPARCEL, SENDMYPARCEL } from '@/data/keys/platformKeys';
import { cutoffTimeHasPassed } from './cutoffTimeHasPassed';
import { getDropOffDay } from './getDropOffDay';

const daysWithoutDelivery = {
  [MYPARCEL]: [MONDAY, SUNDAY],
  [SENDMYPARCEL]: [SATURDAY, SUNDAY],
};

/**
 * @param {import('dayjs').Dayjs}date
 * @param {import('dayjs').Dayjs}currentDeliveryDate
 * @param {MyParcelDeliveryOptions.DeliveryOptionsRequestParameters} args
 * @param {Object|null} extraDelivery
 *
 * @returns {boolean}
 */
export function shouldSkipToNextDeliveryDate(date, currentDeliveryDate, args, extraDelivery) {
  const todayIsDisallowed = daysWithoutDelivery[args.platform].includes(currentDeliveryDate.weekday());
  const dropOffDay = getDropOffDay(date, currentDeliveryDate, args.dropoff_days);

  // Skip Saturday or Monday if its setting is not enabled.
  if (extraDelivery) {
    const extraDeliveryEnabled = Number(args[`${args.platform === MYPARCEL ? 'monday' : 'saturday'}_delivery`]) === 1;
    const isExtraDropOffDay = dropOffDay.weekday() === extraDelivery.dropOffDay;

    if (!extraDeliveryEnabled || !isExtraDropOffDay) {
      return true;
    }
  } else if (todayIsDisallowed) {
    return true;
  }

  // If today is the dropoff day, check if the cutoff time has passed.
  return Boolean(date.isSame(dropOffDay) && cutoffTimeHasPassed(args.cutoff_time, date));
}
