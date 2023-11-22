import {type Dayjs} from 'dayjs';
import {PlatformName} from '@myparcel/constants';
import {type ExtraDelivery, type FakeDeliveryOptionsParameters} from '../../types';
import {MONDAY, SATURDAY, SUNDAY} from '../../constants';
import {getDropOffDay} from './getDropOffDay';
import {cutoffTimeHasPassed} from './cutoffTimeHasPassed';

const daysWithoutDelivery = {
  [PlatformName.MyParcel]: [MONDAY, SUNDAY],
  [PlatformName.SendMyParcel]: [SATURDAY, SUNDAY],
};

export const shouldSkipToNextDeliveryDate = (
  args: FakeDeliveryOptionsParameters,
  date: Dayjs,
  currentDeliveryDate: Dayjs,
  extraDelivery?: ExtraDelivery,
): boolean => {
  const todayIsDisallowed = daysWithoutDelivery[args.platform].includes(currentDeliveryDate.weekday());
  const dropOffDay = getDropOffDay(date, currentDeliveryDate, args.dropOffDays);

  // Skip Saturday or Monday if its setting is not enabled.
  if (extraDelivery) {
    const extraDeliveryEnabled = Boolean(args.mondayDelivery) || Boolean(args.saturdayDelivery);
    const isExtraDropOffDay = dropOffDay.weekday() === extraDelivery.dropOffDay;

    if (!extraDeliveryEnabled || !isExtraDropOffDay) {
      return true;
    }
  } else if (todayIsDisallowed) {
    return true;
  }

  // If today is the drop-off day, check if the cutoff time has passed.
  return Boolean(date.isSame(dropOffDay) && cutoffTimeHasPassed(args.cutoffTime, date));
};
