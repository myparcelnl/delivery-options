import {type ComputedRef, computed, toValue} from 'vue';
import {pascal} from 'radash';
import {isToday} from 'date-fns';
import {
  type SelectOption,
  DELIVERY_TYPE_DEFAULT,
  CarrierSetting,
  DELIVERY_DAYS_WINDOW_DEFAULT,
  SUPPORTED_SHIPMENT_OPTIONS,
  createTranslatable,
} from '@myparcel-dev/do-shared';
import {getDeliveryTypePrice, createPackageTypeTranslatable, stringToDate} from '../utils';
import {useConfigStore} from '../stores';
import {DELIVERY_MOMENT_PACKAGE_TYPES} from '../data';
import {useSelectedValues} from './useSelectedValues';
import {useResolvedDeliveryOptions} from './useResolvedDeliveryOptions';
import {useResolvedDeliveryMoments} from './useResolvedDeliveryMoments';
import {useFeatures} from './useFeatures';
import {useActiveCarriers} from './useActiveCarriers';

// eslint-disable-next-line max-lines-per-function
export const useDeliveryMomentOptions = (): ComputedRef<SelectOption<string>[]> => {
  const {state: config} = useConfigStore();
  const deliveryMoments = useResolvedDeliveryMoments();
  const activeCarriers = useActiveCarriers();
  const {showDeliveryDate} = useFeatures();

  // eslint-disable-next-line max-lines-per-function
  return computed(() => {
    // Some package types will not return any date/time moments from the API - we show one option per carrier instead without any date/time.
    if (!DELIVERY_MOMENT_PACKAGE_TYPES.includes(config.packageType)) {
      return activeCarriers.value
        .filter((carrier) => toValue(carrier.hasAnyDelivery) && toValue(carrier.packageTypes).has(config.packageType))
        .map((carrier) => {
          const carrierIdentifier = toValue(carrier.carrier).identifier;

          return {
            carrier: carrierIdentifier,
            label: createPackageTypeTranslatable(config.packageType),
            price: getDeliveryTypePrice(DELIVERY_TYPE_DEFAULT, carrierIdentifier),
            value: JSON.stringify({
              carrier: carrierIdentifier,
              date: null,
              deliveryType: DELIVERY_TYPE_DEFAULT,
              packageType: config.packageType,
              shipmentOptions: [],
              time: null,
            }),
          };
        });
    }

    // When delivery date is hidden (deliveryDaysWindow <= 1):
    // show one option per active carrier without date
    if (!showDeliveryDate.value) {
      return activeCarriers.value
        .filter((carrier) => toValue(carrier.hasDelivery))
        .map((carrier) => {
          const carrierIdentifier = toValue(carrier.carrier).identifier;

          return {
            carrier: carrierIdentifier,
            label: createTranslatable(`delivery${pascal(DELIVERY_TYPE_DEFAULT)}Title`),
            price: getDeliveryTypePrice(DELIVERY_TYPE_DEFAULT, carrierIdentifier),
            value: JSON.stringify({
              carrier: carrierIdentifier,
              date: null,
              deliveryType: DELIVERY_TYPE_DEFAULT,
              packageType: config.packageType,
              shipmentOptions: [],
              time: null,
            }),
          };
        });
    }

    // Parse the deliveryMoments from the API for the other package types
    const momentOptions = deliveryMoments.value
      .filter((option) => option.packageType === config.packageType)
      .map((option) => {
        return {
          carrier: option.carrier,
          label: option.time,
          price: getDeliveryTypePrice(option.deliveryType, option.carrier),
          value: JSON.stringify({
            time: option.time,
            carrier: option.carrier,
            date: option.date,
            deliveryType: option.deliveryType,
            packageType: option.packageType,
            shipmentOptions: option.shipmentOptions.filter((option) => SUPPORTED_SHIPMENT_OPTIONS.includes(option.name)),
          }),
        };
      });

    // Fallback for active carriers without moments on ANY date (API failed / no dates at all)
    const allDeliveryOptions = useResolvedDeliveryOptions();
    const {deliveryDate} = useSelectedValues();
    const selectedDateIsToday = deliveryDate.value && isToday(stringToDate(deliveryDate.value));

    const carriersWithAnyMoments = new Set(
      allDeliveryOptions.value.filter((opt) => opt.packageType === config.packageType).map((opt) => opt.carrier),
    );
    const fallbackOptions = selectedDateIsToday
      ? []
      : activeCarriers.value
          .filter((carrier) => {
            const id = toValue(carrier.carrier).identifier;

            if (carriersWithAnyMoments.has(id)) return false;

            if (!toValue(carrier.hasDelivery)) return false;

            const deliveryDaysWindow = carrier.get(CarrierSetting.DeliveryDaysWindow, DELIVERY_DAYS_WINDOW_DEFAULT);

            return deliveryDaysWindow !== 0;
          })
          .map((carrier) => {
            const carrierIdentifier = toValue(carrier.carrier).identifier;

            return {
              carrier: carrierIdentifier,
              label: createTranslatable(`delivery${pascal(DELIVERY_TYPE_DEFAULT)}Title`),
              price: getDeliveryTypePrice(DELIVERY_TYPE_DEFAULT, carrierIdentifier),
              value: JSON.stringify({
                carrier: carrierIdentifier,
                date: null,
                deliveryType: DELIVERY_TYPE_DEFAULT,
                packageType: config.packageType,
                shipmentOptions: [],
                time: null,
              }),
            };
          });

    return [...momentOptions, ...fallbackOptions];
  });
};
