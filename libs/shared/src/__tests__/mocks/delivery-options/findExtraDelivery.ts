import {type ExtraDelivery, type FakeDeliveryOptionsParameters} from '../../types';
import {extraDeliveryConfig} from '../../constants';
import {useFullCarrier} from '../../../composables';

export const findExtraDelivery = (
  {carrier, dropOffDays, platform}: FakeDeliveryOptionsParameters,
  dayOfWeek: number,
): ExtraDelivery | undefined => {
  const resolvedCarrier = useFullCarrier(carrier, platform);

  return extraDeliveryConfig.find((setting) => {
    const isToday = setting.deliveryDay === dayOfWeek;
    const hasDropOffDay = dropOffDays.includes(setting.dropOffDay);
    const allowedForCarrierAndPlatform = resolvedCarrier.value.hasFeature(setting.feature);

    return isToday && hasDropOffDay && allowedForCarrierAndPlatform;
  });
};
