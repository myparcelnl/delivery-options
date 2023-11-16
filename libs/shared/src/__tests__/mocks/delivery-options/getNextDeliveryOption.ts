import dayjs from 'dayjs';
import {type DeliveryOption} from '@myparcel/sdk';
import {FEATURES_SAME_DAY_DELIVERY} from '../../../legacy';
import {shouldSkipToNextDeliveryDate} from './shouldSkipToNextDeliveryDate';
import {getCarrierConfiguration} from './getCarrierConfiguration';
import {findExtraDelivery} from './findExtraDelivery';
import {getDeliveryOptionsEntry} from './entries/getDeliveryOptionsEntry';

interface FakeDeliveryOption {
  data: DeliveryOption;
  index: number;
}

/**
 * Returns the next available delivery date, very much like the actual responses from the API. This needs to be
 * quite precise because we can't mock the current date with real api responses.
 */
export const getNextDeliveryOption = (args: object, daysOffset = 0, currentDate = dayjs()): FakeDeliveryOption => {
  const next = () => getNextDeliveryOption(args, daysOffset + 1, currentDate);

  const carrierConfiguration = getCarrierConfiguration(args);
  const canHaveSameDay = carrierConfiguration?.hasFeature(FEATURES_SAME_DAY_DELIVERY);
  const hasSameDayDelivery = daysOffset === 0 && canHaveSameDay;
  const currentDeliveryDate = currentDate.add(daysOffset, 'day');
  const extraDelivery = hasSameDayDelivery ? null : findExtraDelivery(args, currentDeliveryDate.weekday());

  if (
    (daysOffset === 0 && !canHaveSameDay) ||
    shouldSkipToNextDeliveryDate(currentDate, currentDeliveryDate, args, extraDelivery)
  ) {
    return next();
  }

  return {
    index: daysOffset,
    data: getDeliveryOptionsEntry(currentDeliveryDate, Boolean(extraDelivery), hasSameDayDelivery),
  };
};
