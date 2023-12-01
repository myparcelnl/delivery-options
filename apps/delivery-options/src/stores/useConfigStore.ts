import {assign} from 'radash';
import {defineStore} from 'pinia';
import {type DeliveryOptionsConfig, getDefaultConfig} from '@myparcel-do/shared';
import {PlatformName} from '@myparcel/constants';

export const useConfigStore = defineStore('config', {
  state: (): Required<DeliveryOptionsConfig> => {
    const initialConfig = window.MyParcelConfig?.config;

    return assign(getDefaultConfig(initialConfig?.platform ?? PlatformName.MyParcel), initialConfig);
  },
});
