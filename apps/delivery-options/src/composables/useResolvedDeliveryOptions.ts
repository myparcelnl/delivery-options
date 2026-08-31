import {toValue, watch, type ComputedRef} from 'vue';
import {pascal} from 'radash';
import {format, isToday, startOfDay} from 'date-fns';
import {useMemoize} from '@vueuse/core';
import {
  useDeliveryOptionsRequest,
  computedAsync,
  type AnyTranslatable,
  createUntranslatable,
  type ComputedAsync,
  API_DATE_FORMAT,
  CarrierSetting,
  CustomDeliveryType,
  DELIVERY_DAYS_WINDOW_DEFAULT,
  createTranslatable,
  ConfigSetting,
} from '@myparcel-dev/do-shared';
import {
  createGetDeliveryOptionsParameters,
  getResolvedDeliveryType,
  calculateCutoffTime,
  isFallbackEligible,
  isSameDayAvailable,
  parseJson,
  stringToDate,
} from '../utils';
import {type SelectedDeliveryMoment} from '../types';
import {useConfigStore} from '../stores';
import {DELIVERY_MOMENT_PACKAGE_TYPES} from '../data';
import {useTimeRange} from './useTimeRange';
import {useSharedCapabilities} from './useSharedCapabilities';
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
      .filter((carrier) => toValue(carrier.hasDelivery))
      .map(async (carrier) => {
        const deliveryDaysWindow = carrier.get(CarrierSetting.DeliveryDaysWindow, DELIVERY_DAYS_WINDOW_DEFAULT);

        if (!toValue(carrier.hasDelivery) || deliveryDaysWindow === 0) {
          return null;
        }

        const params = createGetDeliveryOptionsParameters(carrier);
        const query = useDeliveryOptionsRequest(params);

        await query.load();

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
// eslint-disable-next-line max-lines-per-function
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
  const sortedClosedDays = [...normalizedClosedDays].sort((dayA, dayB) => dayA.getTime() - dayB.getTime());

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

    // For subsequent days in a consecutive sequence, always filter them out
    return true;
  }

  // Check if delivery date is the day after any closed day or within the dropOffDelay period
  const shouldFilter = sortedClosedDays.some((closedDay) => {
    // Calculate additional days to filter after the closed day
    const additionalDays = dropOffDelay ?? 0;
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

  const [hours = 0, minutes = 0] = cutoffTime.split(':').map(Number);
  const cutoffDate = new Date();
  cutoffDate.setHours(hours, minutes);

  const filteredDates = deliveryOptionsApiData.filter((data) => {
    // Normalize to start of day
    const deliveryDate = startOfDay(new Date(data.date.date));

    // Check if this delivery date should be filtered out
    return !shouldFilterDeliveryDate(deliveryDate, closedDays, dropOffDelay, cutoffDate);
  });

  return filteredDates;
};

/**
 * The stored selection, or undefined when it is missing or not a valid moment.
 */
const parseSelectedDeliveryMoment = (value: string | undefined): SelectedDeliveryMoment | undefined => {
  try {
    const parsed = value ? parseJson<SelectedDeliveryMoment | null>(value) : undefined;

    return typeof parsed?.carrier === 'string' ? parsed : undefined;
  } catch {
    return undefined;
  }
};

/**
 * Whether the currently selected values survive an empty delivery-dates result.
 *
 * A dateless selected moment (date: null) does not depend on delivery dates, so
 * it is kept while its carrier still offers delivery. Carriers resolve to an
 * empty list while capabilities are being re-fetched, so only a non-empty list
 * counts as proof that the carrier is gone. In compact view a selected window-0
 * carrier has no dates by design, so it survives too.
 */
const selectionSurvivesEmptyDates = (carriers: UseResolvedCarrier[]): boolean => {
  const {carrier, deliveryMoment} = useSelectedValues();
  const selectedMoment = parseSelectedDeliveryMoment(deliveryMoment.value);

  if (selectedMoment?.date === null) {
    return (
      carriers.length === 0 ||
      carriers.some((item) => toValue(item.hasDelivery) && toValue(item.carrier).identifier === selectedMoment.carrier)
    );
  }

  const selectedCarrier = carriers.find((item) => toValue(item.carrier).identifier === carrier.value);

  return selectedCarrier?.get(CarrierSetting.DeliveryDaysWindow, DELIVERY_DAYS_WINDOW_DEFAULT) === 0;
};

/**
 * Remove any date records which are completely empty (null or undefined) and
 *  ensures any selected values are cleared if no dates are available.
 *
 * @param datesPerCarrier
 * @param carriers
 * @returns
 */
const removeEmptyEntries = (
  datesPerCarrier: DeliveryDatesPerCarrier[],
  carriers: UseResolvedCarrier[],
): NonNullable<DeliveryDatesPerCarrier>[] => {
  const filteredDates = datesPerCarrier ? datesPerCarrier.filter((item) => item !== null) : [];

  if (filteredDates.length === 0) {
    const {state: config} = useConfigStore();

    if (DELIVERY_MOMENT_PACKAGE_TYPES.includes(config.packageType) && !selectionSurvivesEmptyDates(carriers)) {
      const {clearSelectedValues} = useSelectedValues();

      clearSelectedValues();
    }

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
        const startA = optionA.delivery_time_frames[0]?.date_time.date ?? '';
        const startB = optionB.delivery_time_frames[0]?.date_time.date ?? '';

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
          originalDeliveryType: datePossibility.type,
          packageType: datePossibility.package_type,
          shipmentOptions: datePossibility.shipment_options,
        });
      });
    });

    return acc;
  }, [] as SelectedDeliveryMoment[]);
};

/**
 * The legacy delivery options API does not support every carrier (e.g. Trunkrs).
 * Carriers with same-day delivery enabled and available that got no dates from
 * the API receive a synthetic moment for today, as long as their same-day
 * cutoff has not passed and at least one carrier returned real API dates (so
 * there is a date list to extend). Without any real API dates the dateless
 * fallback options cover these carriers instead. Remove when the API supports
 * these carriers.
 */
const createSameDayFallbackMoments = (
  carriers: UseResolvedCarrier[],
  moments: SelectedDeliveryMoment[],
): SelectedDeliveryMoment[] => {
  const {state: config} = useConfigStore();

  if (!DELIVERY_MOMENT_PACKAGE_TYPES.includes(config.packageType) || moments.length === 0) {
    return [];
  }

  const carriersWithMoments = new Set(moments.map((moment) => moment.carrier));

  // The date string is the join key for the date picker and moment filtering,
  // so reuse the date string of an existing API today-moment when there is one.
  const todayFromApi = moments.find((moment) => moment.date && isToday(stringToDate(moment.date)))?.date;
  const todayDate = todayFromApi ?? format(startOfDay(new Date()), API_DATE_FORMAT);

  return carriers
    .filter((carrier) => isFallbackEligible(carrier, carriersWithMoments) && isSameDayAvailable(carrier))
    .map((carrier) => ({
      carrier: toValue(carrier.carrier).identifier,
      date: todayDate,
      isSynthetic: true,
      time: createTranslatable(`delivery${pascal(CustomDeliveryType.SameDay)}Title`),
      deliveryType: CustomDeliveryType.SameDay,
      packageType: config.packageType,
      shipmentOptions: [],
    }));
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const callback = (): UseResolvedDeliveryOptions => {
  const carriers = useActiveCarriers();
  const capabilities = useSharedCapabilities();

  return computedAsync<SelectedDeliveryMoment[]>(async () => {
    /*
     * Guard: wait for capabilities to finish loading before fetching delivery options.
     *
     * When the address changes, the capabilities API re-fetches asynchronously.
     * During that fetch, capabilities.value still holds data from the PREVIOUS address.
     * useActiveCarriers (which depends on capabilities) would compute with stale
     * carrier data + the new address, producing wrong carrier combinations.
     *
     * API calls with wrong carriers fail (e.g. "street is required") and add exceptions
     * that persist even after correct carriers load and their API calls succeed.
     *
     * By awaiting here, we keep the delivery options in their loading state (preserving
     * the previous value in the UI) until capabilities are current, then proceed with
     * correct carrier data.
     */
    if (capabilities.loading.value) {
      await new Promise<void>((resolve) => {
        const unwatch = watch(
          () => capabilities.loading.value,
          (isLoading) => {
            if (!isLoading) {
              unwatch();
              resolve();
            }
          },
        );
      });
    }

    const datesPerCarrier = await getDeliveryOptionsFromApi(carriers);

    // Filter out any nulls (failed requests)
    const filteredDates = removeEmptyEntries(datesPerCarrier, toValue(carriers));

    // Flatten the dates into SelectedDeliveryMoment objects.
    const moments = formatDatesAsDeliveryMoments(filteredDates);

    return [...moments, ...createSameDayFallbackMoments(toValue(carriers), moments)];
  }, []);
};

export const useResolvedDeliveryOptions = useMemoize(callback);
