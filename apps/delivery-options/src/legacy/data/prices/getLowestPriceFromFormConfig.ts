import {CONFIG} from '@myparcel-do/shared';
import {type CarrierName} from '@myparcel/constants';

/**
 * Finds the lowest price from a form config. Ignores options that are not enabled.
 *
 *
 */
export const getLowestPriceFromFormConfig = (config, carrierName?: CarrierName, configBus = realConfigBus): number => {
  const carriers = carrierName ? [carrierName] : Object.keys(configBus.get(CONFIG.CARRIER_SETTINGS));

  const prices = carriers
    .map((carrierName) => {
      const parentEnabled = configBus.isEnabled(config, null, carrierName);

      // When the entire option is not enabled just return []. It will not be counted or shown.
      if (!parentEnabled) {
        return [];
      }

      return config.options
        .filter((option) => configBus.isEnabled(option, null, carrierName))
        .map((setting) => configBus.get(setting, 'price', carrierName) ?? 0);
    })
    .flat();

  if (!prices.length) {
    throw new Error('"prices" array is empty.');
  }

  return Math.min(...prices);
};
