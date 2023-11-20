import {useMemoize} from '@vueuse/core';
import {configMyParcel, configSendMyParcel} from '@myparcel-do/shared';
import {PlatformName} from '@myparcel/constants';
import {getCurrentPlatform} from '../utils/getCurrentPlatform';

export const usePlatformConfig = useMemoize(
  () => {
    const platform = getCurrentPlatform();

    switch (platform) {
      case PlatformName.MyParcel:
        return configMyParcel();

      case PlatformName.SendMyParcel:
        return configSendMyParcel();
    }
  },
  {
    getKey() {
      return getCurrentPlatform();
    },
  },
);
