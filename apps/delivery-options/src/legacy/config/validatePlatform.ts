import {PLATFORMS} from '@myparcel-do/shared';

/**
 * @param {MyParcel.Platform} platform
 *
 * @returns {MyParcel.Platform}
 */
export function validatePlatform(platform) {
  if (!platform) {
    throw new Error('Platform is missing.');
  }

  if (!Object.values(PLATFORMS).includes(platform)) {
    throw new Error(`Platform "${platform}" is invalid.`);
  }

  return platform;
}
