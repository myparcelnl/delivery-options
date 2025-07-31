import {useMemoize} from '@vueuse/core';
import {PlatformName} from '@myparcel/constants';
import {type PropositionConfiguration} from '../types';
import {getMyParcelConfig, getSendMyParcelConfig, getExternalConfig} from '../config';

export const getPlatformConfig = useMemoize((platform: PlatformName): PropositionConfiguration => {
  // First, try to get external configuration
  const externalConfig = getExternalConfig(platform);
  
  // If external config is available, use it
  if (externalConfig) {
    return externalConfig;
  }

  // Fall back to internal configuration
  switch (platform) {
    case PlatformName.MyParcel:
      return getMyParcelConfig();

    case PlatformName.SendMyParcel:
      return getSendMyParcelConfig();
  }

  throw new Error(`Platform ${platform} is not supported`);
});
