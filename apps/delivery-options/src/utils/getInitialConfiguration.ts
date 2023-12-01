import {assign} from 'radash';
import {useMemoize} from '@vueuse/core';
import {getDefaultConfiguration} from '@myparcel-do/shared';
import {PlatformName} from '@myparcel/constants';

export const getInitialConfiguration = useMemoize(() => {
  const configuration = window.MyParcelConfig ?? {};

  const defaultConfig = getDefaultConfiguration(configuration.config.platform ?? PlatformName.MyParcel);

  return assign(defaultConfig, configuration);
});
