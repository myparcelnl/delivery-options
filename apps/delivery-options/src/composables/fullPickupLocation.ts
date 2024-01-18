import {capitalize, type MaybeRef, type Ref} from 'vue';
import {addDays, isSameDay, isToday} from 'date-fns';
import {asyncComputed, get, useMemoize} from '@vueuse/core';
import {CLOSED, type OutputPickupLocation, resolveRefKey} from '@myparcel-do/shared';
import {type StartEndDate, type Weekday} from '@myparcel/sdk';
import {createNextDate, createUtcDate, getPickupLocationType, getResolvedCarrier} from '../utils';
import {type ResolvedCarrier} from '../types';
import {useConfigStore} from '../stores';
import {useTimeRange} from './useTimeRange';
import {useResolvedPickupLocations} from './useResolvedPickupLocations';
import {useLanguage} from './useLanguage';
import {useFormatDistance} from './useFormatDistance';
import {useDateFormat} from './useDateFormat';

export interface FullPickupLocation {
  carrier: ResolvedCarrier;
  distance: string;
  location: OutputPickupLocation;
  openingHours: {weekday: string; timeString: string}[];
}

export const getFullPickupLocation = useMemoize(
  // eslint-disable-next-line max-lines-per-function
  async (locationCode: string): Promise<FullPickupLocation> => {
    const config = useConfigStore();
    const locations = useResolvedPickupLocations();
    const {translate} = useLanguage();

    const resolvedLocation = (locations.value ?? []).find(({location}) => location.location_code === get(locationCode));

    if (!resolvedLocation) {
      throw new Error();
    }

    const formattedDistance = useFormatDistance(resolvedLocation.location.distance);

    return {
      carrier: await getResolvedCarrier(get(resolvedLocation.carrier), get(config.platform)),

      distance: formattedDistance.value,

      openingHours: Object.values(resolvedLocation.location.opening_hours ?? ({} as Record<Weekday, StartEndDate[]>))
        .map((hours, dayOfWeek) => {
          const date = createNextDate(dayOfWeek);
          const formattedDay = useDateFormat(date);

          const isTodayOrTomorrow = isToday(date) || isSameDay(addDays(createUtcDate(), 1), date);

          const time: StartEndDate = hours?.[0];
          const timeString = time ? useTimeRange(time.start.date, time.end.date).value : translate(CLOSED);

          return {
            date,
            weekday: capitalize(isTodayOrTomorrow ? formattedDay.relative.value : formattedDay.weekday.value),
            timeString,
          };
        })
        .sort((a, b) => a.date.getTime() - b.date.getTime()),

      location: {
        type: getPickupLocationType(resolvedLocation),

        locationCode: resolvedLocation.location.location_code,
        locationName: resolvedLocation.location.location_name,
        retailNetworkId: resolvedLocation.location.retail_network_id,

        latitude: Number(resolvedLocation.location.latitude),
        longitude: Number(resolvedLocation.location.longitude),

        street: resolvedLocation.address.street,
        number: resolvedLocation.address.number,
        numberSuffix: '',
        postalCode: resolvedLocation.address.postal_code,
        city: resolvedLocation.address.city,
        cc: resolvedLocation.address.cc,
      },
    };
  },
  {getKey: resolveRefKey},
);

export const usePickupLocation = (locationCode: MaybeRef<string | undefined>): Ref<FullPickupLocation | undefined> => {
  return asyncComputed(async () => {
    const resolved = get(locationCode);

    if (!resolved) {
      return undefined;
    }

    return getFullPickupLocation(resolved);
  });
};
