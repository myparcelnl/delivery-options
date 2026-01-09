import {toValue, type ComputedRef} from 'vue';
import {pascal} from 'radash';
import {startOfDay} from 'date-fns';
import {useMemoize} from '@vueuse/core';
import {type Replace} from '@myparcel-dev/ts-utils';
import {type Timestamp, type DeliveryOption, type DeliveryPossibility, type DeliveryTimeFrame} from '@myparcel-dev/sdk';
import {
  useDeliveryOptionsRequest,
  computedAsync,
  DELIVERY_TYPE_DEFAULT,
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
import {DELIVERY_MOMENT_PACKAGE_TYPES} from '../data';
import {useTimeRange} from './useTimeRange';
import {useSelectedValues} from './useSelectedValues';
import {type UseResolvedCarrier} from './useResolvedCarrier';
import {createFakeShipmentOptions} from './useFakeShipmentOptions';
import {useActiveCarriers} from './useActiveCarriers';

type FakeDeliveryDates = Replace<
  Replace<DeliveryOption, 'possibilities', Replace<DeliveryPossibility, 'delivery_time_frames', DeliveryTimeFrame[]>[]>,
  'date',
  Timestamp | undefined
>;

type DeliveryOptionsApiData = ReturnType<typeof useDeliveryOptionsRequest>['data']['value'];

/**
 * Create "fake" (undefined) delivery dates and shipment options for each delivery type
 * @returns
 */
const createFakeDeliveryDates = (carrier: UseResolvedCarrier): FakeDeliveryDates[] => {
  // Create fake delivery dates for each package type which may have time frames, if configured for the carrier
  return DELIVERY_MOMENT_PACKAGE_TYPES.reduce((acc, packageType) => {
    if (toValue(carrier.config)?.packageTypes.includes(packageType)) {
      acc.push({
        date: undefined,
        possibilities: [
          {
            type: DELIVERY_TYPE_DEFAULT,
            package_type: packageType,
            delivery_time_frames: [],
            shipment_options: createFakeShipmentOptions(carrier, packageType),
          },
        ],
      });
    }

    return acc;
  }, [] as FakeDeliveryDates[]);
};

type DeliveryDatesPerCarrier = {
  carrier: UseResolvedCarrier;
  dates: FakeDeliveryDates[] | NonNullable<DeliveryOptionsApiData>;
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
          console.log(
            `Skipping delivery options API call for carrier ${carrier.carrier.value.name} as delivery is disabled or delivery days window is 0.`,
            toValue(carrier.hasAnyDelivery),
            deliveryDaysWindow,
          );
          return Promise.resolve({
            carrier,
            dates: createFakeDeliveryDates(carrier),
          });
        }

        const params = createGetDeliveryOptionsParameters(carrier);
        const query = useDeliveryOptionsRequest(params);

        try {
          await query.load();
        } catch (e) {
          console.error('Error loading delivery options:', e);
          // If loading fails, return null so it can be filtered out

          return null;
        }

        const closedDays = getClosedDaysWindow(carrier.get(ConfigSetting.ClosedDays));

        let dates: DeliveryOptionsApiData | null = toValue(query.data);

        if (closedDays.length > 0) {
          const dropOffDelay = carrier.get(CarrierSetting.DropOffDelay);
          const cutoffTime = calculateCutoffTime(carrier);
          dates = filterClosedDays(dates, closedDays, dropOffDelay, cutoffTime);
        }

        return {
          carrier,
          dates: dates?.length ? dates : createFakeDeliveryDates(carrier),
        };
      }),
  );
};

/**
 * This returns all the closed days within the window of 14 days from today.
 * @param {Date[] | undefined} closedDays
 * @returns {Date[]}
 */
const getClosedDaysWindow = (closedDays: Date[] | undefined): Date[] => {
  // We use 14 day as the window for closed days. Because that is the maximum number of days that can be selected
  // inside the plugin.
  const daysWindow = 14;

  // If closedDays is undefined or null, return empty array
  if (!closedDays) {
    return [];
  }

  const today = startOfDay(new Date());
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + daysWindow);

  return closedDays.filter((date) => {
    // Normalize the date to start of day for consistent comparison
    const normalizedDate = startOfDay(date);
    return normalizedDate >= today && normalizedDate <= maxDate;
  });
};

/**
 * Determines if a delivery date should be filtered out based on closed days, drop-off delay, and cutoff time.
 *
 * This function implements a filtering system that considers:
 * - Closed days and their processing requirements
 * - Drop-off delay periods after closed days
 * - Cutoff time for same-day order processing
 *
 * Key Logic:
 * 1. The FIRST closed day in a sequence is only filtered out if there isn't enough processing time before it
 * 2. ALL subsequent consecutive closed days are always unavailable
 * 3. The day after any closed day is ALWAYS unavailable
 * 4. Additional days after closed days are filtered based on dropOffDelay
 * 5. Cutoff time affects the effective order date for processing calculations
 *
 * @param deliveryDate - The delivery date to check for availability
 * @param closedDays - Array of closed days that affect delivery availability
 * @param dropOffDelay - Number of additional days to filter after a closed day (0 = only day after, 1 = day after + 1
 *   more, etc.)
 * @param cutoffDate - The cutoff time for same-day orders (affects effective order date)
 * @returns true if the delivery date should be filtered out (made unavailable)
 */
const shouldFilterDeliveryDate = (
  deliveryDate: Date,
  closedDays: Date[],
  dropOffDelay: number | undefined,
  cutoffDate: Date,
): boolean => {
  const today = startOfDay(new Date());

  // Normalize closed days to start of day for comparison
  const normalizedClosedDays = closedDays.map((day) => {
    // Handle both Date objects and date strings consistently
    const normalized = new Date(day);
    return startOfDay(normalized);
  });

  // Sort closed days to identify consecutive sequences
  const sortedClosedDays = [...normalizedClosedDays].sort((a, b) => a.getTime() - b.getTime());

  // Check if the delivery date is a closed day
  const isClosedDay = sortedClosedDays.some((closedDay) => closedDay.getTime() === deliveryDate.getTime());

  if (isClosedDay) {
    // Find if this closed day is the first in a consecutive sequence
    // Check if the day before this closed day is also closed
    const dayBefore = new Date(deliveryDate);
    dayBefore.setDate(deliveryDate.getDate() - 1);
    const isDayBeforeClosed = sortedClosedDays.some((closedDay) => closedDay.getTime() === dayBefore.getTime());

    if (!isDayBeforeClosed) {
      // This is the first closed day in a sequence, apply the original processing time logic
      const requiredDaysBefore = dropOffDelay || 0;

      const now = new Date();
      const isOrderBeforeCutoff = now <= cutoffDate;

      const effectiveOrderDate = isOrderBeforeCutoff ? today : new Date(today.getTime() + 24 * 60 * 60 * 1000);

      const dayBeforeDropOffDelay = new Date(effectiveOrderDate);
      dayBeforeDropOffDelay.setDate(effectiveOrderDate.getDate() + requiredDaysBefore);
      const normalizedDayBeforeDropOffDelay = startOfDay(dayBeforeDropOffDelay);

      const isDayBeforeDropOffDelayClosed = sortedClosedDays.some(
        (closedDay) => closedDay.getTime() === normalizedDayBeforeDropOffDelay.getTime(),
      );

      return isDayBeforeDropOffDelayClosed;
    }

    // For subsequent days in a consecutive sequence, always filter them out
    return true;
  }

  // Check if delivery date is the day after any closed day or within the dropOffDelay period
  const shouldFilter = sortedClosedDays.some((closedDay) => {
    // Calculate additional days to filter after the closed day
    const additionalDays = dropOffDelay || 0;
    const lastDayToFilter = new Date(closedDay);
    lastDayToFilter.setDate(closedDay.getDate() + 1 + additionalDays);

    // Check if delivery date falls within the filtered period after the closed day
    return deliveryDate > closedDay && deliveryDate <= lastDayToFilter;
  });

  return shouldFilter;
};

/**
 * Filters delivery options data to remove unavailable dates based on closed days and drop-off delay.
 *
 * This function processes the raw delivery options from the API and applies business rules
 * to determine which delivery dates should be available to customers. It considers:
 * - Closed days and their processing requirements
 * - Drop-off delay periods after closed days
 * - Cutoff time for same-day order processing
 *
 * @param deliveryOptionsApiData - Raw delivery options data from the API
 * @param closedDays - Array of closed days that affect delivery availability
 * @param dropOffDelay - Number of additional days to filter after a closed day
 * @param cutoffTime - The cutoff time string (e.g., "16:00") for same-day orders
 * @returns Filtered delivery options data with unavailable dates removed, or null if no data
 */
const filterClosedDays = (
  deliveryOptionsApiData: DeliveryOptionsApiData | null,
  closedDays: Date[],
  dropOffDelay: number | undefined,
  cutoffTime: string,
): DeliveryOptionsApiData | null => {
  if (!deliveryOptionsApiData) {
    return null;
  }

  const [hours, minutes] = cutoffTime.split(':').map(Number);
  const cutoffDate = new Date();
  cutoffDate.setHours(hours, minutes);

  const filteredDates = deliveryOptionsApiData.filter((data) => {
    const deliveryDate = startOfDay(new Date(data.date.date)); // Normalize to start of day

    // Check if this delivery date should be filtered out
    return !shouldFilterDeliveryDate(deliveryDate, closedDays, dropOffDelay, cutoffDate);
  });

  return filteredDates;
};

/**
 * Remove any date records which are completely empty (null or undefined) and
 *  ensures any selected values are cleared if no dates are available.
 *
 * @param dates
 * @returns
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
 * @param datesPerCarrier
 * @returns
 */
const formatDatesAsDeliveryMoments = (
  datesPerCarrier: NonNullable<DeliveryDatesPerCarrier>[],
): SelectedDeliveryMoment[] => {
  return datesPerCarrier.reduce((acc: SelectedDeliveryMoment[], {carrier, dates}) => {
    dates.forEach((dateOption) => {
      /**
       * Sort the possibilities by start date.
       */
      const possibilities = [...dateOption.possibilities].sort((optionA, optionB) => {
        const startA = optionA.delivery_time_frames[0]?.date_time.date;
        const startB = optionB.delivery_time_frames[0]?.date_time.date;

        return startA.localeCompare(startB);
      });

      /**
       * For each possibility, create a SelectedDeliveryMoment object.
       * If the delivery_time_frames are empty, we use the delivery type as the time string.
       */
      possibilities.forEach((datePossibility) => {
        const [start, end] = datePossibility.delivery_time_frames;

        const timeString: AnyTranslatable =
          start && end
            ? createUntranslatable(useTimeRange(start.date_time.date, end.date_time.date).value)
            : createTranslatable(`delivery${pascal(datePossibility.type)}Title`);

        const deliveryType = getResolvedDeliveryType(
          carrier.config.value?.deliveryTypes ?? [],
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
      console.log(
        'Fetching delivery options from API for carriers:',
        toValue(carriers).map((c) => c.carrier.value.name),
      );
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
