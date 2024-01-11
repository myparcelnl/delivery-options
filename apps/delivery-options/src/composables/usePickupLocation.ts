import {capitalize, computed, type ComputedRef, type MaybeRef, type Ref} from 'vue';
import {addDays, isSameDay, isToday} from 'date-fns';
import {get, useMemoize} from '@vueuse/core';
import {
  type CarrierIdentifier,
  CLOSED,
  type FullCarrier,
  type OutputPickupLocation,
  useFullCarrier,
} from '@myparcel-do/shared';
import {type StartEndDate, type Weekday} from '@myparcel/sdk';
import {getPickupLocationType} from '../utils/getPickupLocationType';
import {useFormatDistance} from '../utils/formatDistance';
import {createUtcDate} from '../utils/createUtcDate';
import {createNextDate} from '../utils/createNextDate';
import {createTimeRangeString, findPickupLocation} from '../utils';
import {type ResolvedPickupLocation} from '../types';
import {useConfigStore} from '../stores';
import {useLanguage} from './useLanguage';
import {useDateFormat} from './useDateFormat';

interface UsePickupLocation {
  carrier: Ref<FullCarrier>;
  distance: ComputedRef<string>;
  location: ComputedRef<OutputPickupLocation>;
  openingHours: ComputedRef<{weekday: string; timeString: string}[]>;
}

// eslint-disable-next-line max-lines-per-function
export const usePickupLocation = useMemoize((locationCode: MaybeRef<string>): UsePickupLocation => {
  const resolvedLocation = computed<ResolvedPickupLocation>(() => findPickupLocation(get(locationCode))!);
  const config = useConfigStore();

  const carrier = computed<CarrierIdentifier>(() => resolvedLocation.value.carrier);

  const fullCarrier = useFullCarrier(carrier, config.platform);

  const {translate} = useLanguage();

  const location = computed<OutputPickupLocation>(() => {
    const {address, location} = resolvedLocation.value;

    return {
      type: getPickupLocationType(resolvedLocation.value),

      locationCode: location.location_code,
      locationName: location.location_name,
      retailNetworkId: location.retail_network_id,

      latitude: Number(location.latitude),
      longitude: Number(location.longitude),

      street: address.street,
      number: address.number,
      numberSuffix: '',
      postalCode: address.postal_code,
      city: address.city,
      cc: address.cc,
    };
  });

  const distance = computed(() => {
    const {distance} = resolvedLocation.value.location;

    return distance ? useFormatDistance(distance).value : '';
  });

  const openingHours = computed(() => {
    const days = resolvedLocation.value.location.opening_hours ?? ({} as Record<Weekday, StartEndDate[]>);

    return Object.values(days)
      .map((hours, dayOfWeek) => {
        const date = createNextDate(dayOfWeek);
        const formattedDay = useDateFormat(date);
        const time: StartEndDate = hours?.[0];

        const isTodayOrTomorrow = isToday(date) || isSameDay(addDays(createUtcDate(), 1), date);

        return {
          date,
          weekday: capitalize(isTodayOrTomorrow ? formattedDay.relative.value : formattedDay.weekday.value),
          timeString: time ? createTimeRangeString(time.start.date, time.end.date) : translate(CLOSED),
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  });

  return {
    carrier: fullCarrier,
    distance,
    openingHours,
    location,
  };
});
