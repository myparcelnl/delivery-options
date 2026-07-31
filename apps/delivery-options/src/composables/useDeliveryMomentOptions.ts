import {type ComputedRef, computed, toValue} from 'vue';
import {pascal} from 'radash';
import {isToday} from 'date-fns';
import {
  type AnyTranslatable,
  type CarrierIdentifier,
  type SelectOption,
  type SupportedDeliveryTypeName,
  type SupportedPackageTypeName,
  CarrierSetting,
  CustomDeliveryType,
  DELIVERY_DAYS_WINDOW_DEFAULT,
  DELIVERY_TYPE_DEFAULT,
  SUPPORTED_SHIPMENT_OPTIONS,
  createTranslatable,
} from '@myparcel-dev/do-shared';
import {
  getDeliveryTypePrice,
  createPackageTypeTranslatable,
  stringToDate,
  isFallbackEligible,
  supportsSameDay,
} from '../utils';
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
  deliveryType: SupportedDeliveryTypeName = DELIVERY_TYPE_DEFAULT,
): SelectOption<string> => ({
  carrier: carrierIdentifier,
  label,
  price: getDeliveryTypePrice(deliveryType, carrierIdentifier),
  value: JSON.stringify({
    carrier: carrierIdentifier,
    date: null,
    deliveryType,
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
        // A synthetic moment's date only extends the date picker; it is not
        // backed by an API response, so the selectable value must never
        // promise a delivery date.
        date: option.isSynthetic ? null : option.date,
        deliveryType: option.deliveryType,
        originalDeliveryType: option.originalDeliveryType,
        packageType: option.packageType,
        shipmentOptions: option.shipmentOptions.filter((opt) =>
          (SUPPORTED_SHIPMENT_OPTIONS as readonly string[]).includes(opt.name),
        ),
      }),
    }));

/**
 * The dateless options a carrier can offer: a generic standard delivery
 * option, and a same-day option. Same-day means shipped on the day of
 * delivery, so it is plannable for any day; the cutoff time only gates
 * delivery on today itself, which is handled by the synthetic today moment.
 */
const createCarrierDatelessOptions = (
  carrier: UseResolvedCarrier,
  packageType: SupportedPackageTypeName,
): SelectOption<string>[] => {
  const {identifier} = toValue(carrier.carrier);
  const options: SelectOption<string>[] = [];

  if (toValue(carrier.deliveryTypes).has(DELIVERY_TYPE_DEFAULT)) {
    options.push(
      createDatelessDeliveryOption(
        identifier,
        createTranslatable(`delivery${pascal(DELIVERY_TYPE_DEFAULT)}Title`),
        packageType,
      ),
    );
  }

  if (supportsSameDay(carrier)) {
    options.push(
      createDatelessDeliveryOption(
        identifier,
        createTranslatable(`delivery${pascal(CustomDeliveryType.SameDay)}Title`),
        packageType,
        CustomDeliveryType.SameDay,
      ),
    );
  }

  return options;
};

/**
 * Options when the delivery date is hidden (deliveryDaysWindow <= 1): the
 * dateless options per carrier supporting delivery.
 */
const getDatelessDeliveryOptions = (
  carriers: UseResolvedCarrier[],
  packageType: SupportedPackageTypeName,
): SelectOption<string>[] => {
  return carriers
    .filter((carrier) => toValue(carrier.hasDelivery))
    .flatMap((carrier) => createCarrierDatelessOptions(carrier, packageType));
};

/**
 * Dateless options for carriers whose own delivery-days window is 0. They never get
 * dates from the API, so they show up next to the dated carriers - the same behaviour
 * as a global window of 0, just applied per carrier. Carriers with a window of 1 or
 * more are handled through their API delivery moments instead, so they are skipped.
 */
const getWindowZeroDatelessOptions = (
  carriers: UseResolvedCarrier[],
  packageType: SupportedPackageTypeName,
): SelectOption<string>[] => {
  return carriers
    .filter(
      (carrier) =>
        toValue(carrier.hasDelivery) &&
        carrier.get(CarrierSetting.DeliveryDaysWindow, DELIVERY_DAYS_WINDOW_DEFAULT) === 0,
    )
    .flatMap((carrier) => createCarrierDatelessOptions(carrier, packageType));
};

/**
 * Fallback options for carriers that have no real API delivery moments on any
 * date. Skipped when the selected date is today: a dateless standard delivery
 * cannot arrive today, and same-day on today is covered by the synthetic
 * today moment while its cutoff has not passed.
 */
const getFallbackCarrierOptions = (
  carriers: UseResolvedCarrier[],
  packageType: SupportedPackageTypeName,
  carriersWithRealMoments: Set<CarrierIdentifier>,
  selectedDateIsToday: boolean,
): SelectOption<string>[] => {
  if (selectedDateIsToday) {
    return [];
  }

  return carriers
    .filter((carrier) => isFallbackEligible(carrier, carriersWithRealMoments))
    .flatMap((carrier) => createCarrierDatelessOptions(carrier, packageType));
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

    const datelessOptions = getWindowZeroDatelessOptions(activeCarriers.value, config.packageType);

    const momentOptions = getMomentOptions(deliveryMoments.value, config.packageType);

    const allDeliveryOptions = useResolvedDeliveryOptions();
    const {deliveryDate} = useSelectedValues();
    const selectedDateIsToday = Boolean(deliveryDate.value && isToday(stringToDate(deliveryDate.value)));

    const carriersWithRealMoments = new Set(
      allDeliveryOptions.value
        .filter((opt) => !opt.isSynthetic && opt.packageType === config.packageType)
        .map((opt) => opt.carrier),
    );

    const fallbackOptions = getFallbackCarrierOptions(
      activeCarriers.value,
      config.packageType,
      carriersWithRealMoments,
      selectedDateIsToday,
    );

    return [...datelessOptions, ...momentOptions, ...fallbackOptions];
  });
};
