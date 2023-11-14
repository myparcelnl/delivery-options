import {CONFIG, extraDeliveryConfig, getCarrierConfiguration} from '@myparcel-do/shared';

export const getExtraDropOffDay = (configBus = realConfigBus) => {
  const platform = configBus.get(CONFIG.PLATFORM);
  const carrierConfiguration = getCarrierConfiguration(configBus.currentCarrier, platform);

  return extraDeliveryConfig.find((setting) => {
    const allowedForCarrierAndPlatform = carrierConfiguration.hasFeature(setting.requires);
    const requiredOptionsPresent = setting.requires.every(configBus.get);

    return allowedForCarrierAndPlatform && requiredOptionsPresent;
  });
};
