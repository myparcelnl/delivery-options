import {computed, type MaybeRef, type ComputedRef} from 'vue';
import {type DateLike} from '@vueuse/core';
import {useDateFormat} from './useDateFormat';

export const useTimeRange = (startDate: MaybeRef<DateLike>, endDate: MaybeRef<DateLike>): ComputedRef<string> => {
  const formattedStartDate = useDateFormat(startDate);
  const formattedEndDate = useDateFormat(endDate);

  return computed(() => `${formattedStartDate.time.value} – ${formattedEndDate.time.value}`);
};
