import {useMemoize} from '@vueuse/core';
import {PlatformName} from '@myparcel/constants';
import {type SupportedPlatformName} from '../types';
import {configMyParcel, configSendMyParcel} from '../data';

export const getPlatformConfig = useMemoize((platform: SupportedPlatformName) => {
  switch (platform) {
    case PlatformName.MyParcel:
      return configMyParcel();

    case PlatformName.SendMyParcel:
      return configSendMyParcel();
  }
});
