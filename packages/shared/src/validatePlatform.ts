import {PLATFORMS, PlatformName} from '@myparcel/sdk';

export const validatePlatform = (platform?: PlatformName): PlatformName => {
  if (!platform) {
    throw new Error('Platform is missing.');
  }

  if (!PLATFORMS.ALL.map((platform) => platform.NAME).includes(platform)) {
    throw new Error(`Platform "${platform}" is invalid.`);
  }

  return platform;
};
