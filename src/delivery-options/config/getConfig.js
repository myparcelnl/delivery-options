import { DEFAULT_PLATFORM } from '@/data/keys/settingsConsts';
import { configurationMerger } from '@/delivery-options/config/configurationMerger';
import { defaultConfiguration } from '@/config/defaultConfiguration';
import { getWindowObject } from '@/delivery-options/config/getWindowObject';
import mergeWith from 'lodash-es/mergeWith';

/**
 * Get data from the window config object and convert some variables.
 *
 * @param {?MyParcelDeliveryOptions.Configuration} configuration - Data to merge with the default configuration.
 *
 * @returns {MyParcelDeliveryOptions.Configuration}
 */
export const getConfig = (configuration = getWindowObject()) => {
  // Get the given platform or fall back to default
  const platform = configuration.config ? configuration.config.platform : DEFAULT_PLATFORM;

  /**
   * Merge the config data with the default config.
   *
   * @see https://lodash.cobm/docs/4.17.15#mergeWith
   */
  return mergeWith({}, defaultConfiguration(platform), configuration, configurationMerger);
};
