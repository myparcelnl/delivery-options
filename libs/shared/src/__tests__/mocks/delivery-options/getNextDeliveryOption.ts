import dayjs from 'dayjs';
import {CarrierSetting} from '@myparcel-do/shared';
import {type DeliveryOption} from '@myparcel/sdk';
import {type FakeDeliveryOptionsParameters} from '../../types';
import {useFullCarrier} from '../../../composables';
import {shouldSkipToNextDeliveryDate} from './shouldSkipToNextDeliveryDate';
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
export const getNextDeliveryOption = (
  args: FakeDeliveryOptionsParameters,
  daysOffset = 0,
  currentDate = dayjs(),
): FakeDeliveryOption => {
  const next = () => getNextDeliveryOption(args, daysOffset + 1, currentDate);

  const fullCarrier = useFullCarrier(args.carrier, args.platform);
  const canHaveSameDay = fullCarrier.value.hasFeature(CarrierSetting.AllowSameDayDelivery);

  const hasSameDayDelivery = daysOffset === 0 && canHaveSameDay;
  const currentDeliveryDate = currentDate.add(daysOffset, 'day');
  const extraDelivery = hasSameDayDelivery ? undefined : findExtraDelivery(args, currentDeliveryDate.day());

  if (
    (daysOffset === 0 && !canHaveSameDay) ||
    shouldSkipToNextDeliveryDate(args, currentDate, currentDeliveryDate, extraDelivery)
  ) {
    return next();
  }

  return {
    index: daysOffset,
    data: getDeliveryOptionsEntry(currentDeliveryDate, Boolean(extraDelivery), hasSameDayDelivery),
  };
};
