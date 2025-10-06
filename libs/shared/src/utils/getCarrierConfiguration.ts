import {
  type CarrierIdentifier,
  type CarrierConfiguration,
  type SupportedPlatformName,
  type PlatformConfiguration,
} from '../types';
import {KEY_PLATFORM_CONFIG} from '../data';
import {resolveCarrierName} from './resolveCarrierName';
import {getPlatformConfig} from './getPlatformConfig';

export const getCarrierConfiguration = (
  carrierIdentifier: CarrierIdentifier,
  platform: SupportedPlatformName,
): CarrierConfiguration => {
  const platformConfig = window.MyParcelConfig?.[KEY_PLATFORM_CONFIG]
    ? (window.MyParcelConfig?.[KEY_PLATFORM_CONFIG] as PlatformConfiguration)
    : getPlatformConfig(platform);

  const carrierName = resolveCarrierName(carrierIdentifier);

  const carrierConfig = platformConfig.carriers.find((carrier) => carrier.name === carrierName);

  if (!carrierConfig) {
    throw new Error(`No configuration found for carrier ${carrierIdentifier}`);
  }

  return carrierConfig;
};
