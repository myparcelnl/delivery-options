import {getDay, isToday} from 'date-fns';
import {useMemoize} from '@vueuse/core';
import {
  CustomDeliveryType,
  DAY_MONDAY,
  DAY_SATURDAY,
  type SupportedDeliveryTypeName,
  type Weekday,
} from '@myparcel-do/shared';
import {DeliveryTypeName} from '@myparcel/constants';

const DAYS_MAP = Object.freeze<Partial<Record<Weekday, CustomDeliveryType>>>({
  [DAY_MONDAY]: CustomDeliveryType.Monday,
  [DAY_SATURDAY]: CustomDeliveryType.Saturday,
});

/**
 * Gets an available non-standard delivery type based on the delivery date.
 */
export const getResolvedDeliveryType = useMemoize(
  (
    deliveryTypes: SupportedDeliveryTypeName[],
    date: string | undefined,
    deliveryType: DeliveryTypeName,
  ): SupportedDeliveryTypeName => {
    if (deliveryType !== DeliveryTypeName.Standard) {
      return deliveryType;
    }

    if (!date) {
      return deliveryType;
    }

    const dateInstance = new Date(date);

    const isTodayDate = isToday(dateInstance);

    if (isTodayDate) {
      return CustomDeliveryType.SameDay;
    }

    const day = getDay(dateInstance) as Weekday;

    const resolvedDeliveryType = DAYS_MAP[day] ?? deliveryType;

    if (deliveryTypes?.includes(resolvedDeliveryType)) {
      return resolvedDeliveryType;
    }

    return deliveryType;
  },
);
