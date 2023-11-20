import {get} from '@vueuse/core';
import {type SupportedPlatformName} from '@myparcel-do/shared';
import {PlatformName} from '@myparcel/constants';
import {useSandboxStore} from '../stores';

export const getCurrentPlatform = (): SupportedPlatformName => {
  const store = useSandboxStore();

  const {platform} = get(store.configuration)?.config ?? {};

  return platform ?? PlatformName.MyParcel;
};
