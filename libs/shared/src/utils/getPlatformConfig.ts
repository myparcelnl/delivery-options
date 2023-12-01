import {useMemoize} from '@vueuse/core';
import {PlatformName} from '@myparcel/constants';
import {type PlatformOptions, type SupportedPlatformName} from '../types';
import {configMyParcel, configSendMyParcel} from '../data';

export const getPlatformConfig = useMemoize((platform: SupportedPlatformName): PlatformOptions => {
  switch (platform) {
    case PlatformName.MyParcel:
      return configMyParcel();

    case PlatformName.SendMyParcel:
      return configSendMyParcel();
  }
});
