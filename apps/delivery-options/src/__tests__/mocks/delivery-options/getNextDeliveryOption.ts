import {addDays} from 'date-fns';
import {type ResolvedMockDeliveryOptionsParameters} from '@myparcel-do/shared/testing';
import {CarrierSetting, useFullCarrier} from '@myparcel-do/shared';
import {type DeliveryOption} from '@myparcel/sdk';
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
export const getNextDeliveryOption = async (
  args: ResolvedMockDeliveryOptionsParameters,
  daysOffset = 0,
  currentDate: Date = new Date(),
): Promise<FakeDeliveryOption> => {
  const currentDeliveryDate = addDays(new Date(currentDate), daysOffset);

  const fullCarrier = useFullCarrier(args.carrier, args.platform);

  const canHaveSameDay = fullCarrier.value.hasFeature(CarrierSetting.AllowSameDayDelivery);
  const hasSameDayDelivery = daysOffset === 0 && canHaveSameDay;

  const extraDelivery = hasSameDayDelivery
    ? undefined
    : findExtraDelivery(args, currentDeliveryDate.getDay(), fullCarrier.value);

  if (
    (daysOffset === 0 && !canHaveSameDay) ||
    shouldSkipToNextDeliveryDate(args, currentDate, currentDeliveryDate, extraDelivery)
  ) {
    return getNextDeliveryOption(args, daysOffset + 1, currentDate);
  }

  return {
    index: daysOffset,
    data: getDeliveryOptionsEntry(currentDeliveryDate, Boolean(extraDelivery), hasSameDayDelivery),
  };
};
