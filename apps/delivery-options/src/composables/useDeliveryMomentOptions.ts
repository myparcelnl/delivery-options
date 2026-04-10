import {type ComputedRef, computed, toValue} from 'vue';
import {pascal} from 'radash';
import {isToday} from 'date-fns';
import {
  type AnyTranslatable,
  type CarrierIdentifier,
  type SelectOption,
  type SupportedPackageTypeName,
  DELIVERY_TYPE_DEFAULT,
  CarrierSetting,
  DELIVERY_DAYS_WINDOW_DEFAULT,
  SUPPORTED_SHIPMENT_OPTIONS,
  createTranslatable,
} from '@myparcel-dev/do-shared';
import {getDeliveryTypePrice, createPackageTypeTranslatable, stringToDate} from '../utils';
import {type SelectedDeliveryMoment} from '../types';
import {useConfigStore} from '../stores';
import {DELIVERY_MOMENT_PACKAGE_TYPES} from '../data';
import {useSelectedValues} from './useSelectedValues';
import {useResolvedDeliveryOptions} from './useResolvedDeliveryOptions';
import {useResolvedDeliveryMoments} from './useResolvedDeliveryMoments';
import {type UseResolvedCarrier} from './useResolvedCarrier';
import {useFeatures} from './useFeatures';
import {useActiveCarriers} from './useActiveCarriers';

/**
 * Build a delivery option without a specific date/time.
 * Shared by all code paths that show a single option per carrier.
 */
const createDatelessDeliveryOption = (
  carrierIdentifier: CarrierIdentifier,
  label: AnyTranslatable,
  packageType: SupportedPackageTypeName,
): SelectOption<string> => ({
  carrier: carrierIdentifier,
  label,
  price: getDeliveryTypePrice(DELIVERY_TYPE_DEFAULT, carrierIdentifier),
  value: JSON.stringify({
    carrier: carrierIdentifier,
    date: null,
    deliveryType: DELIVERY_TYPE_DEFAULT,
    packageType,
    shipmentOptions: [],
    time: null,
  }),
});

/**
 * Options for package types that never have date/time moments (e.g. mailbox, digital stamp).
 * One option per carrier that supports the package type.
 */
const getPackageTypeOptions = (
  carriers: UseResolvedCarrier[],
  packageType: SupportedPackageTypeName,
): SelectOption<string>[] => {
  return carriers
    .filter((carrier) => toValue(carrier.hasDelivery) && toValue(carrier.packageTypes).has(packageType))
    .map((carrier) => {
      return createDatelessDeliveryOption(
        toValue(carrier.carrier).identifier,
        createPackageTypeTranslatable(packageType),
        packageType,
      );
    });
};

/**
 * Map resolved delivery moments for a given package type to select options.
 */
const getMomentOptions = (
  moments: SelectedDeliveryMoment[],
  packageType: SupportedPackageTypeName,
): SelectOption<string>[] =>
  moments
    .filter((option) => option.packageType === packageType)
    .map((option) => ({
      carrier: option.carrier,
      label: option.time,
      price: getDeliveryTypePrice(option.deliveryType, option.carrier),
      value: JSON.stringify({
        time: option.time,
        carrier: option.carrier,
        date: option.date,
        deliveryType: option.deliveryType,
        packageType: option.packageType,
        shipmentOptions: option.shipmentOptions.filter((opt) =>
          (SUPPORTED_SHIPMENT_OPTIONS as readonly string[]).includes(opt.name),
        ),
      }),
    }));

/**
 * Options when the delivery date is hidden (deliveryDaysWindow <= 1).
 * One generic "standard delivery" option per carrier.
 */
const getDatelessDeliveryOptions = (
  carriers: UseResolvedCarrier[],
  packageType: SupportedPackageTypeName,
): SelectOption<string>[] => {
  return carriers
    .filter((carrier) => toValue(carrier.hasDelivery))
    .map((carrier) => {
      return createDatelessDeliveryOption(
        toValue(carrier.carrier).identifier,
        createTranslatable(`delivery${pascal(DELIVERY_TYPE_DEFAULT)}Title`),
        packageType,
      );
    });
};

/**
 * Fallback options for carriers that have no API delivery moments on any date.
 * Skipped when the selected date is today (no same-day fallback).
 */
const getFallbackCarrierOptions = (
  carriers: UseResolvedCarrier[],
  packageType: SupportedPackageTypeName,
  carriersWithAnyMoments: Set<CarrierIdentifier>,
  selectedDateIsToday: boolean,
): SelectOption<string>[] => {
  if (selectedDateIsToday) {
    return [];
  }

  return carriers
    .filter((carrier) => {
      const id = toValue(carrier.carrier).identifier;

      if (carriersWithAnyMoments.has(id)) return false;

      if (!toValue(carrier.hasDelivery)) return false;

      const deliveryDaysWindow = carrier.get(CarrierSetting.DeliveryDaysWindow, DELIVERY_DAYS_WINDOW_DEFAULT);

      return deliveryDaysWindow !== 0;
    })
    .map((carrier) => {
      return createDatelessDeliveryOption(
        toValue(carrier.carrier).identifier,
        createTranslatable(`delivery${pascal(DELIVERY_TYPE_DEFAULT)}Title`),
        packageType,
      );
    });
};

export const useDeliveryMomentOptions = (): ComputedRef<SelectOption<string>[]> => {
  const {state: config} = useConfigStore();
  const deliveryMoments = useResolvedDeliveryMoments();
  const activeCarriers = useActiveCarriers();
  const {showDeliveryDate} = useFeatures();

  return computed(() => {
    if (!DELIVERY_MOMENT_PACKAGE_TYPES.includes(config.packageType)) {
      return getPackageTypeOptions(activeCarriers.value, config.packageType);
    }

    if (!showDeliveryDate.value) {
      return getDatelessDeliveryOptions(activeCarriers.value, config.packageType);
    }

    const momentOptions = getMomentOptions(deliveryMoments.value, config.packageType);

    const allDeliveryOptions = useResolvedDeliveryOptions();
    const {deliveryDate} = useSelectedValues();
    const selectedDateIsToday = Boolean(deliveryDate.value && isToday(stringToDate(deliveryDate.value)));

    const carriersWithAnyMoments = new Set(
      allDeliveryOptions.value.filter((opt) => opt.packageType === config.packageType).map((opt) => opt.carrier),
    );

    const fallbackOptions = getFallbackCarrierOptions(
      activeCarriers.value,
      config.packageType,
      carriersWithAnyMoments,
      selectedDateIsToday,
    );

    return [...momentOptions, ...fallbackOptions];
  });
};
