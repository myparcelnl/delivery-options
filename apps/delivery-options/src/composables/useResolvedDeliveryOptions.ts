import {toValue} from 'vue';
import {pascal} from 'radash';
import {useMemoize} from '@vueuse/core';
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
} from '@myparcel-do/shared';
import {type Replace} from '@myparcel/ts-utils';
import {type Timestamp, type DeliveryOption, type DeliveryPossibility, type DeliveryTimeFrame} from '@myparcel/sdk';
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
  carriers: ComputedAsync<UseResolvedCarrier[]>,
): Promise<DeliveryDatesPerCarrier[]> => {
  return Promise.all(
    toValue(carriers)
      .filter((carrier) => toValue(carrier.hasAnyDelivery))
      .map(async (carrier) => {
        const deliveryDaysWindow = carrier.get(CarrierSetting.DeliveryDaysWindow, DELIVERY_DAYS_WINDOW_DEFAULT);

        if (!toValue(carrier.hasDelivery) || deliveryDaysWindow === 0) {
          return Promise.resolve({carrier, dates: createFakeDeliveryDates(carrier)});
        }

        const params = createGetDeliveryOptionsParameters(carrier);
        const query = useDeliveryOptionsRequest(params);

        try {
          await query.load();
        } catch {
          // If loading fails, return null so it can be filtered out
          return null;
        }

        const closedDays = getClosedDaysWindow(carrier.get(ConfigSetting.ClosedDays));
        const dropOffDelay = carrier.get(CarrierSetting.DropOffDelay);
        const cutoffTime = calculateCutoffTime(carrier);
        let dates: DeliveryOptionsApiData | null = toValue(query.data);
        dates = filterClosedDays(dates, closedDays, dropOffDelay, cutoffTime);

        return {carrier, dates: dates?.length ? dates : createFakeDeliveryDates(carrier)};
      }),
  );
};

const getClosedDaysWindow = (closedDays: Date[] | undefined): Date[] => {
  const daysWindow = 14;

  // If closedDays is undefined or null, return empty array
  if (!closedDays) {
    return [];
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + daysWindow);
  return closedDays.filter((dateString) => {
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    return date >= today && date <= maxDate;
  });
};

/**
 * Determines if a delivery date should be filtered out based on closed days, drop-off delay, and cutoff time.
 *
 * This function implements a sophisticated filtering system that considers:
 * - Closed days and their processing requirements
 * - Drop-off delay periods after closed days
 * - Cutoff time for same-day order processing
 * - Consecutive closed days (first day follows processing rules, subsequent days are always unavailable)
 *
 * Key Logic:
 * 1. The FIRST closed day in a sequence is only filtered out if there isn't enough processing time before it
 * 2. ALL subsequent consecutive closed days are always unavailable
 * 3. The day after any closed day sequence is ALWAYS unavailable
 * 4. Additional days after closed day sequences are filtered based on dropOffDelay
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
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Normalize closed days to start of day for comparison
  const normalizedClosedDays = closedDays.map((day) => {
    const normalized = new Date(day);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  });

  // Sort closed days to identify consecutive sequences
  const sortedClosedDays = [...normalizedClosedDays].sort((a, b) => a.getTime() - b.getTime());

  // Find all consecutive sequences of closed days
  const sequences: Date[][] = [];
  let currentSequence: Date[] = [];
  
  for (let i = 0; i < sortedClosedDays.length; i++) {
    const currentDay = sortedClosedDays[i];
    const previousDay = i > 0 ? sortedClosedDays[i - 1] : null;
    
    if (previousDay) {
      const dayDifference = (currentDay.getTime() - previousDay.getTime()) / (24 * 60 * 60 * 1000);
      if (dayDifference === 1) {
        // Consecutive day, add to current sequence
        currentSequence.push(currentDay);
      } else {
        // Non-consecutive day, start new sequence
        if (currentSequence.length > 0) {
          sequences.push([...currentSequence]);
        }
        currentSequence = [currentDay];
      }
    } else {
      // First day
      currentSequence = [currentDay];
    }
  }
  
  // Add the last sequence
  if (currentSequence.length > 0) {
    sequences.push(currentSequence);
  }

  // Check if the delivery date is a closed day
  const isClosedDay = sortedClosedDays.some((closedDay) => closedDay.getTime() === deliveryDate.getTime());

  if (isClosedDay) {
    // Find which sequence this delivery date belongs to
    const containingSequence = sequences.find(sequence => 
      sequence.some(day => day.getTime() === deliveryDate.getTime())
    );
    
    if (containingSequence) {
      const isFirstInSequence = containingSequence[0].getTime() === deliveryDate.getTime();
      
      if (isFirstInSequence) {
        // For the first closed day in a sequence, apply the original processing time logic
        const requiredDaysBefore = dropOffDelay || 0;

        const now = new Date();
        const isOrderBeforeCutoff = now <= cutoffDate;

        const effectiveOrderDate = isOrderBeforeCutoff ? today : new Date(today.getTime() + 24 * 60 * 60 * 1000);

        const dayBeforeDropOffDelay = new Date(effectiveOrderDate);
        dayBeforeDropOffDelay.setDate(effectiveOrderDate.getDate() + requiredDaysBefore);
        dayBeforeDropOffDelay.setHours(0, 0, 0, 0);

        const isDayBeforeDropOffDelayClosed = sortedClosedDays.some(
          (closedDay) => closedDay.getTime() === dayBeforeDropOffDelay.getTime(),
        );

        return isDayBeforeDropOffDelayClosed;
      } else {
        // For subsequent days in a consecutive sequence, always filter them out
        return true;
      }
    }
  }

  // Check if delivery date falls within any sequence or the filtered period after it
  const shouldFilter = sequences.some((sequence) => {
    const sequenceStart = sequence[0];
    const sequenceEnd = sequence[sequence.length - 1];

    // Calculate additional days to filter after the sequence
    const additionalDays = dropOffDelay || 0;
    const lastDayToFilter = new Date(sequenceEnd);
    lastDayToFilter.setDate(sequenceEnd.getDate() + 1 + additionalDays);

    // Check if delivery date falls within the sequence or the filtered period after it
    return deliveryDate >= sequenceStart && deliveryDate <= lastDayToFilter;
  });

  if (shouldFilter) {
    return true;
  }

  return false;
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
    const deliveryDate = new Date(data.date.date);
    deliveryDate.setHours(0, 0, 0, 0); // Normalize to start of day

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

  return computedAsync<SelectedDeliveryMoment[]>(async () => {
    const datesPerCarrier = await getDeliveryOptionsFromApi(carriers);

    // Filter out any nulls (failed requests)
    const filteredDates = removeEmptyEntries(datesPerCarrier);

    // Flatten the dates into SelectedDeliveryMoment objects.
    return formatDatesAsDeliveryMoments(filteredDates);
  }, []);
};

export const useResolvedDeliveryOptions = useMemoize(callback);
