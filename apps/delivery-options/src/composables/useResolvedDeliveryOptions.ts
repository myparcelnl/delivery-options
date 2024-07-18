/* eslint-disable max-nested-callbacks */
import {toValue, computed} from 'vue';
import {useMemoize} from '@vueuse/core';
import {
  useDeliveryOptionsRequest,
  computedAsync,
  PACKAGE_TYPE_DEFAULT,
  DELIVERY_TYPE_DEFAULT,
  type AnyTranslatable,
  createUntranslatable,
  resolveCarrierName,
  type ComputedAsync,
  addLoadingProperties,
} from '@myparcel-do/shared';
import {type Replace} from '@myparcel/ts-utils';
import {type Timestamp, type DeliveryOption, type DeliveryPossibility, type DeliveryTimeFrame} from '@myparcel/sdk';
import {createGetDeliveryOptionsParameters, getResolvedDeliveryType, createDeliveryTypeTranslatable} from '../utils';
import {type SelectedDeliveryMoment} from '../types';
import {useTimeRange} from './useTimeRange';
import {useActiveCarriers} from './useActiveCarriers';

type FakeDeliveryDates = Replace<
  Replace<DeliveryOption, 'possibilities', Replace<DeliveryPossibility, 'delivery_time_frames', DeliveryTimeFrame[]>[]>,
  'date',
  Timestamp | undefined
>;

const createFakeDeliveryDates = (): FakeDeliveryDates[] => {
  return [
    {
      date: undefined,
      possibilities: [
        {
          type: DELIVERY_TYPE_DEFAULT,
          package_type: PACKAGE_TYPE_DEFAULT,
          delivery_time_frames: [],
          shipment_options: [],
        },
      ],
    },
  ];
};

type UseResolvedDeliveryOptions = ComputedAsync<SelectedDeliveryMoment[]>;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const callback = (): UseResolvedDeliveryOptions => {
  const carriers = useActiveCarriers();

  const asyncComputed = computedAsync<SelectedDeliveryMoment[]>(async () => {
    const resolvedDates = await Promise.all(
      toValue(carriers)
        .filter((carrier) => toValue(carrier.hasAnyDelivery))
        .map(async (carrier) => {
          if (!toValue(carrier.hasDelivery)) {
            return Promise.resolve({carrier, dates: createFakeDeliveryDates()});
          }

          const params = createGetDeliveryOptionsParameters(carrier);
          const query = useDeliveryOptionsRequest(params);

          await query.load();

          const dates = toValue(query.data);

          return {carrier, dates: dates?.length ? dates : createFakeDeliveryDates()};
        }),
    );

    return resolvedDates.reduce((acc: SelectedDeliveryMoment[], {carrier, dates}) => {
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

          acc.push({
            carrier: carrier.carrier.value.identifier,
            date: dateOption.date?.date,
            time: timeString,
            deliveryType: getResolvedDeliveryType(
              carrier.config.value?.deliveryTypes ?? [],
              dateOption.date?.date,
              datePossibility.type,
            ),
            packageType: datePossibility.package_type,
            shipmentOptions: datePossibility.shipment_options,
          });
        });
      });

      return acc;
    }, [] as SelectedDeliveryMoment[]);
  }, []);

  const final = computed(() => {
    return asyncComputed.value.filter((option) => {
      const carrierName = resolveCarrierName(option.carrier);
      const carrier = carriers.value.find(({carrier}) => carrier.value.name === carrierName);

      return carrier?.deliveryTypes.value.has(option.deliveryType);
    });
  });

  return addLoadingProperties(final, asyncComputed.load, asyncComputed.loading);
};

export const useResolvedDeliveryOptions = useMemoize(callback);
