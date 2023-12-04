import {assign} from 'radash';
import {defineStore} from 'pinia';
import {type DeliveryOptionsConfig, getDefaultConfig} from '@myparcel-do/shared';
import {PlatformName} from '@myparcel/constants';
import {getConfigFromWindow} from '../utils';

export const useConfigStore = defineStore('config', {
  state: (): Required<DeliveryOptionsConfig> => {
    const initialConfig = getConfigFromWindow();
    const platform = initialConfig?.config?.platform ?? PlatformName.MyParcel;

    return assign(getDefaultConfig(platform), initialConfig);
  },
});
