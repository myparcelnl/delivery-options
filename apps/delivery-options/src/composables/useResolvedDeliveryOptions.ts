/* eslint-disable max-nested-callbacks */
import {toValue} from 'vue';
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
} from '@myparcel-do/shared';
import {type Replace} from '@myparcel/ts-utils';
import {type Timestamp, type DeliveryOption, type DeliveryPossibility, type DeliveryTimeFrame} from '@myparcel/sdk';
import {createGetDeliveryOptionsParameters, getResolvedDeliveryType, createDeliveryTypeTranslatable} from '../utils';
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

type UseResolvedDeliveryOptions = ComputedAsync<SelectedDeliveryMoment[]>;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const callback = (): UseResolvedDeliveryOptions => {
  const carriers = useActiveCarriers();

  return computedAsync<SelectedDeliveryMoment[]>(async () => {
    const resolvedDates = await Promise.all(
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

          const dates = toValue(query.data);

          return {carrier, dates: dates?.length ? dates : createFakeDeliveryDates(carrier)};
        }),
    );

    // Filter out any nulls (failed requests)
    const filteredDates = resolvedDates.filter(
      (
        item,
      ): item is {
        carrier: UseResolvedCarrier;
        dates: FakeDeliveryDates[];
      } => item !== null,
    );

    if (filteredDates.length === 0) {
      const {clearSelectedValues} = useSelectedValues();
      clearSelectedValues();
      return [];
    }

    // Flatten the dates and sort them by date
    return filteredDates.reduce(
      (
        acc: SelectedDeliveryMoment[],
        {
          carrier,
          dates,
        }: {
          carrier: UseResolvedCarrier;
          dates: FakeDeliveryDates[];
        },
      ) => {
        dates.forEach((dateOption) => {
          /**
           * Sort the possibilities by start date.
           */
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
                : createDeliveryTypeTranslatable(datePossibility.type);

            const deliveryType = getResolvedDeliveryType(
              carrier.config.value?.deliveryTypes ?? [],
              dateOption.date?.date,
              datePossibility.type,
            );

            // Skip any type that is not supported by the carrier
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
      },
      [] as SelectedDeliveryMoment[],
    );
  }, []);
};

export const useResolvedDeliveryOptions = useMemoize(callback);
