import {useMemoize} from '@vueuse/core';
import {PlatformName} from '@myparcel/constants';
import {type PlatformOptions} from '../types';
import {getMyParcelConfig, getSendMyParcelConfig} from '../config';

export const getPlatformConfig = useMemoize((platform: PlatformName): PlatformOptions => {
  switch (platform) {
    case PlatformName.MyParcel:
      return getMyParcelConfig();

    case PlatformName.SendMyParcel:
      return getSendMyParcelConfig();
  }

  throw new Error(`Platform ${platform} is not supported`);
});
