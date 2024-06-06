import {assign} from 'radash';
import {defineStore} from 'pinia';
import {
  type DeliveryOptionsConfig,
  getDefaultDeliveryOptionsConfig,
  PLATFORM_DEFAULT,
  useSdk,
  ConfigSetting,
} from '@myparcel-do/shared';
import {getDefaultConfigForPlatform} from '../config';

/**
 * @see setConfiguration for changing the configuration.
 */
export const useConfigStore = defineStore('config', {
  state: getDefaultDeliveryOptionsConfig,

  actions: {
    update(configuration: DeliveryOptionsConfig): void {
      configuration.platform ??= PLATFORM_DEFAULT;

      const newConfiguration = assign(getDefaultConfigForPlatform(configuration.platform), configuration);

      // Reinitialize the SDK only if the API base URL has changed.
      if (newConfiguration[ConfigSetting.ApiBaseUrl] !== this[ConfigSetting.ApiBaseUrl]) {
        const {initialize} = useSdk();

        initialize({baseUrl: newConfiguration[ConfigSetting.ApiBaseUrl]});
      }

      Object.assign(this, newConfiguration);
    },
  },
});
