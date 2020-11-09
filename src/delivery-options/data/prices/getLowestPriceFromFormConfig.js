import * as CONFIG from '@/data/keys/configKeys';
import { configBus as realConfigBus } from '@/delivery-options/config/configBus';

/**
 * Finds the lowest price from a form config. Ignores options that are not enabled.
 *
 * @param {MyParcelDeliveryOptions.FormConfig} config - Names of price settings.
 * @param {MyParcel.CarrierName} carrierName
 * @param {import('@/delivery-options/config/configBus')} configBus - Optional parameter for easier testing.
 *
 * @returns {Number}
 */
export function getLowestPriceFromFormConfig(config, carrierName = null, configBus = realConfigBus) {
  const carriers = carrierName ? [carrierName] : Object.keys(configBus.get(CONFIG.CARRIER_SETTINGS));

  const prices = carriers
    .map((carrierName) => {
      const parentEnabled = configBus.isEnabled(config, null, carrierName);

      // When the entire option is not enabled just return 0. It will not be counted or shown.
      if (!parentEnabled) {
        return [0];
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
}
