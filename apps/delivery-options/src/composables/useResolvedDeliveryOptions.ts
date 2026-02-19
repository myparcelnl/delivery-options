import {toValue, type ComputedRef} from 'vue';
import {pascal} from 'radash';
import {startOfDay} from 'date-fns';
import {useMemoize} from '@vueuse/core';
import {
  useDeliveryOptionsRequest,
  computedAsync,
  type AnyTranslatable,
  createUntranslatable,
  type ComputedAsync,
  CarrierSetting,
  DELIVERY_DAYS_WINDOW_DEFAULT,
  createTranslatable,
  ConfigSetting,
} from '@myparcel-dev/do-shared';
import {createGetDeliveryOptionsParameters, getResolvedDeliveryType, calculateCutoffTime} from '../utils';
import {type SelectedDeliveryMoment} from '../types';
import {useTimeRange} from './useTimeRange';
import {useSelectedValues} from './useSelectedValues';
import {type UseResolvedCarrier} from './useResolvedCarrier';
import {useActiveCarriers} from './useActiveCarriers';

type DeliveryOptionsApiData = ReturnType<typeof useDeliveryOptionsRequest>['data']['value'];

type DeliveryDatesPerCarrier = {
  carrier: UseResolvedCarrier;
  dates: NonNullable<DeliveryOptionsApiData>;
} | null;

type UseResolvedDeliveryOptions = ComputedAsync<SelectedDeliveryMoment[]>;

const getDeliveryOptionsFromApi = async (
  carriers: ComputedRef<UseResolvedCarrier[]>,
): Promise<DeliveryDatesPerCarrier[]> => {
  return Promise.all(
    toValue(carriers)
      .filter((carrier) => toValue(carrier.hasAnyDelivery))
      .map(async (carrier) => {
        const deliveryDaysWindow = carrier.get(CarrierSetting.DeliveryDaysWindow, DELIVERY_DAYS_WINDOW_DEFAULT);

        if (!toValue(carrier.hasDelivery) || deliveryDaysWindow === 0) {
          return null;
        }

        const params = createGetDeliveryOptionsParameters(carrier);
        const query = useDeliveryOptionsRequest(params);

        try {
          await query.load();
        } catch (error) {
          console.error('Error loading delivery options:', error); // eslint-disable-line no-console
          return null;
        }

        const closedDays = getClosedDaysWindow(carrier.get(ConfigSetting.ClosedDays));

        let dates: DeliveryOptionsApiData | null = toValue(query.data);

        if (closedDays.length > 0) {
          const dropOffDelay = carrier.get(CarrierSetting.DropOffDelay);
          const cutoffTime = calculateCutoffTime(carrier);
          dates = filterClosedDays(dates, closedDays, dropOffDelay, cutoffTime);
        }

        if (!dates?.length) {
          return null;
        }

        return {
          carrier,
          dates,
        };
      }),
  );
};

/**
 * This returns all the closed days within the window of 14 days from today.
 */
const getClosedDaysWindow = (closedDays: Date[] | undefined): Date[] => {
  const daysWindow = 14;

  if (!closedDays) {
    return [];
  }

  const today = startOfDay(new Date());
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + daysWindow);

  return closedDays.filter((date) => {
    const normalizedDate = startOfDay(date);
    return normalizedDate >= today && normalizedDate <= maxDate;
  });
};

// eslint-disable-next-line max-lines-per-function
const shouldFilterDeliveryDate = (
  deliveryDate: Date,
  closedDays: Date[],
  dropOffDelay: number | undefined,
  cutoffDate: Date,
): boolean => {
  const today = startOfDay(new Date());

  const normalizedClosedDays = closedDays.map((day) => {
    const normalized = new Date(day);
    return startOfDay(normalized);
  });

  const sortedClosedDays = [...normalizedClosedDays].sort((dayA, dayB) => dayA.getTime() - dayB.getTime());

  const isClosedDay = sortedClosedDays.some((closedDay) => closedDay.getTime() === deliveryDate.getTime());

  if (isClosedDay) {
    const dayBefore = new Date(deliveryDate);
    dayBefore.setDate(deliveryDate.getDate() - 1);
    const isDayBeforeClosed = sortedClosedDays.some((closedDay) => closedDay.getTime() === dayBefore.getTime());

    if (!isDayBeforeClosed) {
      const requiredDaysBefore = dropOffDelay ?? 0;

      const now = new Date();
      const isOrderBeforeCutoff = now <= cutoffDate;

      const MS_PER_DAY = 24 * 60 * 60 * 1000; // eslint-disable-line @typescript-eslint/no-magic-numbers
      const effectiveOrderDate = isOrderBeforeCutoff ? today : new Date(today.getTime() + MS_PER_DAY);

      const dayBeforeDropOffDelay = new Date(effectiveOrderDate);
      dayBeforeDropOffDelay.setDate(effectiveOrderDate.getDate() + requiredDaysBefore);
      const normalizedDayBeforeDropOffDelay = startOfDay(dayBeforeDropOffDelay);

      const isDayBeforeDropOffDelayClosed = sortedClosedDays.some(
        (closedDay) => closedDay.getTime() === normalizedDayBeforeDropOffDelay.getTime(),
      );

      return isDayBeforeDropOffDelayClosed;
    }

    return true;
  }

  const shouldFilter = sortedClosedDays.some((closedDay) => {
    const additionalDays = dropOffDelay ?? 0;
    const lastDayToFilter = new Date(closedDay);
    lastDayToFilter.setDate(closedDay.getDate() + 1 + additionalDays);

    return deliveryDate > closedDay && deliveryDate <= lastDayToFilter;
  });

  return shouldFilter;
};

const filterClosedDays = (
  deliveryOptionsApiData: DeliveryOptionsApiData | null,
  closedDays: Date[],
  dropOffDelay: number | undefined,
  cutoffTime: string,
): DeliveryOptionsApiData | null => {
  if (!deliveryOptionsApiData) {
    return null;
  }

  const [hours = 0, minutes = 0] = cutoffTime.split(':').map(Number);
  const cutoffDate = new Date();
  cutoffDate.setHours(hours, minutes);

  const filteredDates = deliveryOptionsApiData.filter((data) => {
    const deliveryDate = startOfDay(new Date(data.date.date));

    return !shouldFilterDeliveryDate(deliveryDate, closedDays, dropOffDelay, cutoffDate);
  });

  return filteredDates;
};

/**
 * Remove any null entries and clear selected values if no dates are available.
 */
const removeEmptyEntries = (datesPerCarrier: DeliveryDatesPerCarrier[]): NonNullable<DeliveryDatesPerCarrier>[] => {
  const filteredDates = datesPerCarrier ? datesPerCarrier.filter((item) => item !== null) : [];

  if (filteredDates.length === 0) {
    const {clearSelectedValues} = useSelectedValues();
    clearSelectedValues();
    return [];
  }

  return filteredDates;
};

/**
 * Given a list of delivery dates per carrier, format them into SelectedDeliveryMoment objects.
 */
const formatDatesAsDeliveryMoments = (
  datesPerCarrier: NonNullable<DeliveryDatesPerCarrier>[],
): SelectedDeliveryMoment[] => {
  return datesPerCarrier.reduce((acc: SelectedDeliveryMoment[], {carrier, dates}) => {
    dates.forEach((dateOption) => {
      const possibilities = [...dateOption.possibilities].sort((optionA, optionB) => {
        const startA = optionA.delivery_time_frames[0]?.date_time.date;
        const startB = optionB.delivery_time_frames[0]?.date_time.date;

        return startA.localeCompare(startB);
      });

      possibilities.forEach((datePossibility) => {
        const [start, end] = datePossibility.delivery_time_frames;

        const timeString: AnyTranslatable =
          start && end
            ? createUntranslatable(useTimeRange(start.date_time.date, end.date_time.date).value)
            : createTranslatable(`delivery${pascal(datePossibility.type)}Title`);

        const deliveryType = getResolvedDeliveryType(
          [...carrier.deliveryTypes.value],
          dateOption.date?.date,
          datePossibility.type,
        );

        // Skip any delivery type that is not supported by the carrier
        if (!carrier?.deliveryTypes.value.has(deliveryType)) {
          return;
        }

        acc.push({
          carrier: carrier.carrier.value.identifier,
          date: dateOption.date?.date,
          time: timeString,
          deliveryType,
          packageType: datePossibility.package_type,
          shipmentOptions: datePossibility.shipment_options,
        });
      });
    });

    return acc;
  }, [] as SelectedDeliveryMoment[]);
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const callback = (): UseResolvedDeliveryOptions => {
  const carriers = useActiveCarriers();

  return computedAsync<SelectedDeliveryMoment[]>(
    async () => {
      const datesPerCarrier = await getDeliveryOptionsFromApi(carriers);

      // Filter out any nulls (failed requests)
      const filteredDates = removeEmptyEntries(datesPerCarrier);

      // Flatten the dates into SelectedDeliveryMoment objects.
      return formatDatesAsDeliveryMoments(filteredDates);
    },
    [],
    {
      // eslint-disable-next-line id-length
      onError: (e) => {
        // eslint-disable-next-line no-console
        console.error(e);
      },
    },
  );
};

export const useResolvedDeliveryOptions = useMemoize(callback);
