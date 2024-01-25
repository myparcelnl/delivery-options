import {computed, type MaybeRef} from 'vue';
import {type DateLike} from '@vueuse/core';
import {type ComputedRef} from '@vue/reactivity';
import {useDateFormat} from './useDateFormat';

export const useTimeRange = (startDate: MaybeRef<DateLike>, endDate: MaybeRef<DateLike>): ComputedRef<string> => {
  const formattedStartDate = useDateFormat(startDate);
  const formattedEndDate = useDateFormat(endDate);

  return computed(() => `${formattedStartDate.time} – ${formattedEndDate.time}`);
};
