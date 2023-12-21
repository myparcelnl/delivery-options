import {type DateLike} from '@vueuse/core';
import {useDateFormat} from '../composables';

export const createTimeRangeString = (startDate: DateLike, endDate: DateLike): string => {
  const formattedStartDate = useDateFormat(startDate);
  const formattedEndDate = useDateFormat(endDate);

  return `${formattedStartDate.time.value} – ${formattedEndDate.time.value}`;
};
