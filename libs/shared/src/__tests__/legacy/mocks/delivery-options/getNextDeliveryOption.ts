import { FEATURES_SAME_DAY_DELIVERY } from '@/data/carrierFeatures';
import { dayjs } from '@Tests/dayjs';
import { findExtraDelivery } from './findExtraDelivery';
import { getCarrierConfiguration } from './getCarrierConfiguration';
import { getDeliveryOptionsEntry } from './entries/getDeliveryOptionsEntry';
import { shouldSkipToNextDeliveryDate } from './shouldSkipToNextDeliveryDate';

/**
 * Returns the next available delivery date, very much like the actual responses from the API. This needs to be
 * quite precise because we can't mock the current date with real api responses.
 *
 * @param {MyParcelDeliveryOptions.DeliveryOptionsRequestParameters} args
 * @param {number} daysOffset
 * @param {import('dayjs').Dayjs} currentDate
 *
 * @returns {Object}
 */
export function getNextDeliveryOption(args, daysOffset = 0, currentDate = dayjs()) {
  const next = () => getNextDeliveryOption(args, daysOffset + 1, currentDate);

  const carrierConfiguration = getCarrierConfiguration(args);
  const canHaveSameDay = carrierConfiguration && carrierConfiguration.hasFeature(FEATURES_SAME_DAY_DELIVERY);
  const hasSameDayDelivery = daysOffset === 0 && canHaveSameDay;
  const currentDeliveryDate = currentDate.add(daysOffset, 'day');
  const extraDelivery = hasSameDayDelivery ? null : findExtraDelivery(args, currentDeliveryDate.weekday());

  if ((daysOffset === 0 && !canHaveSameDay)
    || shouldSkipToNextDeliveryDate(currentDate, currentDeliveryDate, args, extraDelivery)) {
    return next();
  }

  return {
    index: daysOffset,
    data: getDeliveryOptionsEntry(
      currentDeliveryDate,
      Boolean(extraDelivery),
      hasSameDayDelivery,
    ),
  };
}
