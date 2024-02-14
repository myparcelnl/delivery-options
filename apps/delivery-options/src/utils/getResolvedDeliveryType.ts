import {getDay, isToday} from 'date-fns';
import {useMemoize} from '@vueuse/core';
import {CustomDeliveryType, DAY_MONDAY, DAY_SATURDAY, type SupportedDeliveryTypeName} from '@myparcel-do/shared';
import {DeliveryTypeName} from '@myparcel/constants';

export const getResolvedDeliveryType = useMemoize(
  (date: string, deliveryType: DeliveryTypeName): SupportedDeliveryTypeName => {
    if (deliveryType !== DeliveryTypeName.Standard) {
      return deliveryType;
    }

    const dateInstance = new Date(date);

    const isTodayDate = isToday(dateInstance);

    if (isTodayDate) {
      return CustomDeliveryType.SameDay;
    }

    const day = getDay(dateInstance);

    let resolvedDeliveryType: DeliveryTypeName | CustomDeliveryType = deliveryType;

    switch (day) {
      case DAY_MONDAY:
        resolvedDeliveryType = CustomDeliveryType.Monday;
        break;

      case DAY_SATURDAY:
        resolvedDeliveryType = CustomDeliveryType.Saturday;
        break;
    }

    return resolvedDeliveryType;
  },
);
