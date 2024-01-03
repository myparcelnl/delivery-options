import {computed, type ComputedRef, type MaybeRef} from 'vue';
import {isToday} from 'date-fns';
import {get, useMemoize} from '@vueuse/core';
import {CLOSED, type FullCarrier, type OutputPickupLocation, useFullCarrier} from '@myparcel-do/shared';
import {type StartEndDate, type Weekday} from '@myparcel/sdk';
import {getPickupLocationType} from '../utils/getPickupLocationType';
import {useFormatDistance} from '../utils/formatDistance';
import {createNextDate} from '../utils/createNextDate';
import {createTimeRangeString} from '../utils';
import {type ResolvedPickupLocation} from '../types';
import {useConfigStore} from '../stores';
import {useLanguage} from './useLanguage';
import {useDateFormat} from './useDateFormat';

interface UsePickupLocation {
  carrier: ComputedRef<FullCarrier | undefined>;
  distance: ComputedRef<string>;
  location: ComputedRef<OutputPickupLocation | undefined>;
  openingHours: ComputedRef<{weekday: string; timeString: string}[]>;
}

// eslint-disable-next-line max-lines-per-function
export const usePickupLocation = useMemoize((locationJson: MaybeRef<string | undefined>): UsePickupLocation => {
  const {translate} = useLanguage();

  const resolvedLocation = computed<ResolvedPickupLocation | undefined>(() => JSON.parse(get(locationJson)));

  const location = computed<OutputPickupLocation | undefined>(() => {
    if (!resolvedLocation.value) {
      return undefined;
    }

    return {
      type: getPickupLocationType(resolvedLocation.value),

      locationCode: resolvedLocation.value.location.location_code,
      locationName: resolvedLocation.value.location.location_name,
      retailNetworkId: resolvedLocation.value.location.retail_network_id,

      street: resolvedLocation.value.address.street,
      number: resolvedLocation.value.address.number,
      numberSuffix: '',
      postalCode: resolvedLocation.value.address.postal_code,
      city: resolvedLocation.value.address.city,
      cc: resolvedLocation.value.address.cc,
    };
  });

  const distance = computed(() => {
    const distance = resolvedLocation.value?.location.distance;

    return distance ? useFormatDistance(distance).value : '';
  });

  const openingHours = computed(() => {
    const days = resolvedLocation.value?.location.opening_hours ?? ({} as Record<Weekday, StartEndDate[]>);

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

  const carrier = computed(() => {
    const carrier = resolvedLocation.value?.carrier;

    if (!carrier) {
      return undefined;
    }

    const config = useConfigStore();

    return useFullCarrier(carrier, config.platform).value;
  });

  return {carrier, location, distance, openingHours};
});
