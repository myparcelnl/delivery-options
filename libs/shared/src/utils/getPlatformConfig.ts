import {useMemoize} from '@vueuse/core';
import {configMyParcel, configSendMyParcel} from '@myparcel-do/shared';
import {PlatformName} from '@myparcel/constants';
import {type SupportedPlatformName} from '../types';

export const getPlatformConfig = useMemoize((platform: SupportedPlatformName) => {
  switch (platform) {
    case PlatformName.MyParcel:
      return configMyParcel();

    case PlatformName.SendMyParcel:
      return configSendMyParcel();
  }
});
