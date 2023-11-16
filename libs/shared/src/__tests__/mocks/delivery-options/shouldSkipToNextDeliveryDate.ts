import {PlatformName} from '@myparcel/constants';
import {MONDAY, SATURDAY, SUNDAY} from '../../../legacy';
import {getDropOffDay} from './getDropOffDay';
import {cutoffTimeHasPassed} from './cutoffTimeHasPassed';

const daysWithoutDelivery = {
  [PlatformName.MyParcel]: [MONDAY, SUNDAY],
  [PlatformName.SendMyParcel]: [SATURDAY, SUNDAY],
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
    const extraDeliveryEnabled =
      Number(args[`${args.platform === PlatformName.MyParcel ? 'monday' : 'saturday'}_delivery`]) === 1;
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
