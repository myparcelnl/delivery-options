import {computed, type ComputedRef, type MaybeRef} from 'vue';
import {isToday} from 'date-fns';
import {get, useMemoize} from '@vueuse/core';
import {CLOSED} from '@myparcel-do/shared';
import {type StartEndDate, type Weekday} from '@myparcel/sdk';
import {useFormatDistance} from '../utils/formatDistance';
import {createNextDate} from '../utils/createNextDate';
import {createTimeRangeString} from '../utils';
import {type ResolvedPickupLocation} from '../types';
import {useResolvedPickupLocations} from './useResolvedPickupLocations';
import {useLanguage} from './useLanguage';
import {useDateFormat} from './useDateFormat';

interface UsePickupLocation {
  address: ComputedRef<string>;
  distance: ComputedRef<string>;
  isLocker: ComputedRef<boolean>;
  location: ComputedRef<ResolvedPickupLocation | undefined>;
  openingHours: ComputedRef<{weekday: string; timeString: string}[]>;
}

export const usePickupLocation = useMemoize((locationCode: MaybeRef<string>): UsePickupLocation => {
  const pickupLocations = useResolvedPickupLocations();
  const {translate} = useLanguage();

  const location = computed(() => {
    const resolvedLocations = get(pickupLocations.value) ?? [];
    const resolvedLocationCode = get(locationCode);

    return resolvedLocations.find((location) => location.location.location_code === resolvedLocationCode);
  });

  const address = computed(() => {
    const address = location.value?.address;

    return address ? `${address.street} ${address.number}, ${address.city}` : '';
  });

  const distance = computed(() => {
    const distance = location.value?.location.distance;

    return distance ? useFormatDistance(distance).value : '';
  });

  const openingHours = computed(() => {
    const days = location.value?.location.opening_hours ?? ({} as Record<Weekday, StartEndDate[]>);

    return Object.values(days)
      .map((hours, dayOfWeek) => {
        const date = createNextDate(dayOfWeek);
        const formattedDay = useDateFormat(date);
        const time: StartEndDate = hours?.[0];

        return {
          date,
          weekday: isToday(date) ? formattedDay.relative.value : formattedDay.weekday.value,
          timeString: time ? createTimeRangeString(time.start.date, time.end.date) : translate(CLOSED),
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  });

  const isLocker = computed(() => {
    return location.value?.address.number_suffix === 'PBA';
  });

  return {location, address, distance, openingHours, isLocker};
});
