import {PlatformName} from '@myparcel/constants';

/**
 * Map platform names to their respective URLs.
 */
export const platformUrlMap = {
  [PlatformName.MyParcel as const]: 'myparcel.nl',
  [PlatformName.SendMyParcel as const]: 'sendmyparcel.be',
};
