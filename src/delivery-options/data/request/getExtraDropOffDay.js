import * as CONFIG from '@/data/keys/configKeys';
import { CarrierConfigurationFactory } from '@/data/carriers/carrierConfigurationFactory';
import { extraDeliveryConfig } from '@/config/extraDeliveryConfig';
import { configBus as realConfigBus } from '@/delivery-options/config/configBus';

/**
 * @param {import('@/delivery-options/config/configBus').configBus} configBus
 *
 * @returns {Object}
 */
export function getExtraDropOffDay(configBus = realConfigBus) {
  const platform = configBus.get(CONFIG.PLATFORM);
  const carrierConfiguration = CarrierConfigurationFactory.create(configBus.currentCarrier, platform);

  return extraDeliveryConfig.find((setting) => {
    const allowedForCarrierAndPlatform = carrierConfiguration.hasFeature(setting.requires);
    const requiredOptionsPresent = setting.requires.every(configBus.get);
    const dropOffDays = configBus.get(CONFIG.DROP_OFF_DAYS);
    const theRightDay = dropOffDays && dropOffDays.includes(setting.dropOffDay);

    return allowedForCarrierAndPlatform && requiredOptionsPresent && theRightDay;
  });
}
