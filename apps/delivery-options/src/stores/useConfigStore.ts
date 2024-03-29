import {assign} from 'radash';
import {defineStore} from 'pinia';
import {type DeliveryOptionsConfig, getDefaultDeliveryOptionsConfig, PLATFORM_DEFAULT} from '@myparcel-do/shared';
import {getDefaultConfigForPlatform} from '../config';

/**
 * @see setConfiguration for changing the configuration.
 */
export const useConfigStore = defineStore('config', {
  state: getDefaultDeliveryOptionsConfig,

  actions: {
    update(configuration: DeliveryOptionsConfig): void {
      configuration.platform ??= PLATFORM_DEFAULT;

      Object.assign(this, assign(getDefaultConfigForPlatform(configuration.platform), configuration));
    },
  },
});
