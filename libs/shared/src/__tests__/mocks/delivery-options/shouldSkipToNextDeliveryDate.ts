import {getDay, isSameDay} from 'date-fns';
import {PlatformName} from '@myparcel-dev/constants';
import {type ExtraDelivery, type ResolvedMockDeliveryOptionsParameters} from '../../types';
import {isPastTime} from '../../../utils';
import {DAY_MONDAY, DAY_SATURDAY, DAY_SUNDAY} from '../../../data';
import {getDropOffDay} from './getDropOffDay';

const daysWithoutDelivery = {
  [PlatformName.MyParcel]: [DAY_MONDAY, DAY_SUNDAY],
  [PlatformName.SendMyParcel]: [DAY_SATURDAY, DAY_SUNDAY],
};

export const shouldSkipToNextDeliveryDate = (
  args: ResolvedMockDeliveryOptionsParameters,
  date: Date,
  currentDeliveryDate: Date,
  extraDelivery?: ExtraDelivery,
): boolean => {
  const todayIsDisallowed = daysWithoutDelivery[args.platform].includes(currentDeliveryDate.getDay());
  const dropOffDay = getDropOffDay(date, currentDeliveryDate, args.dropOffDays);

  // Skip Saturday or Monday if its setting is not enabled.
  if (extraDelivery) {
    const extraDeliveryEnabled = Boolean(args.mondayDelivery) || Boolean(args.saturdayDelivery);
    const isExtraDropOffDay = getDay(dropOffDay) === extraDelivery.dropOffDay;

    if (!extraDeliveryEnabled || !isExtraDropOffDay) {
      return true;
    }
  } else if (todayIsDisallowed) {
    return true;
  }

  // If today is the drop-off day, check if the cutoff time has passed.
  return Boolean(isSameDay(date, dropOffDay) && isPastTime(args.cutoffTime, date));
};
