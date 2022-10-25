import {ConfigurationMerger} from '../delivery-options/config/configurationMerger';
import {DEFAULT_PLATFORM} from '../data/keys/settingsConsts';
import {getWindowObject} from '../delivery-options/config/getWindowObject';

/**
 * Get data from the window config object and convert some variables.
 *
 * @param {?MyParcelDeliveryOptions.Configuration} configuration - Data to merge with the default configuration.
 *
 * @returns {MyParcelDeliveryOptions.Configuration}
 */
export const getConfig = (configuration = getWindowObject()) => {
  // Get the given platform or fall back to default
  const platform = configuration.config?.platform ?? DEFAULT_PLATFORM;
  const configurationMerger = new ConfigurationMerger(platform, configuration);

  return configurationMerger.getMerged();
};
