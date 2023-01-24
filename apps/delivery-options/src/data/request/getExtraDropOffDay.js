import {CONFIG} from '../../data';
import { CarrierConfigurationFactory } from '../../data/carriers/carrierConfigurationFactory';
import { extraDeliveryConfig } from '../../config/extraDeliveryConfig';
import { configBus as realConfigBus } from '../../config/configBus';

/**
 * @param {import('../../config/configBus').configBus} configBus
 *
 * @returns {Object}
 */
export function getExtraDropOffDay(configBus = realConfigBus) {
  const platform = configBus.get(CONFIG.PLATFORM);
  const carrierConfiguration = CarrierConfigurationFactory.create(configBus.currentCarrier, platform);

  return extraDeliveryConfig.find((setting) => {
    const allowedForCarrierAndPlatform = carrierConfiguration.hasFeature(setting.requires);
    const requiredOptionsPresent = setting.requires.every(configBus.get);

    return allowedForCarrierAndPlatform && requiredOptionsPresent;
  });
}
