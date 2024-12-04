import {addDays} from 'date-fns';
import {type DeliveryOption} from '@myparcel/sdk';
import {type ResolvedMockDeliveryOptionsParameters} from '../../types';
import {CarrierSetting} from '../../../data';
import {useCarrier} from '../../../composables';
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

  const carrierInstance = useCarrier({carrierIdentifier: args.carrier, platformName: args.platform});

  const canHaveSameDay = carrierInstance.features.value.has(CarrierSetting.AllowSameDayDelivery);
  const hasSameDayDelivery = daysOffset === 0 && canHaveSameDay;
  const hasExpressDelivery = carrierInstance.features.value.has(CarrierSetting.AllowExpressDelivery);

  const extraDelivery = hasSameDayDelivery
    ? undefined
    : findExtraDelivery(args, currentDeliveryDate.getDay(), carrierInstance);

  if (
    (daysOffset === 0 && !canHaveSameDay) ||
    shouldSkipToNextDeliveryDate(args, currentDate, currentDeliveryDate, extraDelivery)
  ) {
    return getNextDeliveryOption(args, daysOffset + 1, currentDate);
  }

  return {
    index: daysOffset,
    data: getDeliveryOptionsEntry(currentDeliveryDate, Boolean(extraDelivery), hasSameDayDelivery, hasExpressDelivery),
  };
};
