import { CarrierConfigurationFactory } from '@/data/carriers/carrierConfigurationFactory';
import { extraDeliveryConfig } from '@/config/extraDeliveryConfig';
import { platformCarrierMap } from '@/config/platform/platformCarrierMap';

/**
 * Use passed args to find a valid extra delivery day.
 *
 * @param {Object} args
 * @param {number} dayOfWeek
 *
 * @returns {Object}
 */
export function findExtraDelivery(args, dayOfWeek) {
  // Falls back to the first carrier for current platform.
  const carrier = args.carrier ?? platformCarrierMap[args.platform][0];
  const carrierConfiguration = CarrierConfigurationFactory.create(carrier, args.platform);

  return extraDeliveryConfig.find((setting) => {
    const isToday = setting.deliveryDay === dayOfWeek;
    const hasDropOffDay = args.dropoff_days.includes(setting.dropOffDay);
    const allowedForCarrierAndPlatform = carrierConfiguration.hasFeature(setting.requires);

    return isToday && hasDropOffDay && allowedForCarrierAndPlatform;
  });
}
