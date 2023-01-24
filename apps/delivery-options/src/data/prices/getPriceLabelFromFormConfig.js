import {CONFIG} from '../../data';
import {STRINGS} from '../../data';
import { formatCurrency } from '../../data/prices/formatCurrency';
import { getLowestPriceFromFormConfig } from '../../data/prices/getLowestPriceFromFormConfig';
import { configBus as realConfigBus } from '../../config/configBus';

/**
 * Create a price label from a form config object. Returns a string with "from x" or "x discount" based on the minimum
 *  price of all options in the given form config.
 *
 * @param {MyParcelDeliveryOptions.FormConfig} formSettings
 * @param {MyParcel.CarrierName} carrier
 * @param {import('../../config/configBus')} configBus - Optional parameter for easier testing.
 *
 * @returns {?string}
 */
export function getPriceLabelFromFormConfig(formSettings, carrier = null, configBus = realConfigBus) {
  const minimumPrice = getLowestPriceFromFormConfig(formSettings, carrier, configBus);
  const showPrices = configBus.get(CONFIG.SHOW_PRICES);
  const showPriceSurcharge = configBus.get(CONFIG.SHOW_PRICE_SURCHARGE);

  if (!showPrices || (showPriceSurcharge && minimumPrice === 0)) {
    return null;
  }

  const formattedPrice = formatCurrency(minimumPrice, configBus);
  const isDiscount = minimumPrice < 0;

  if (isDiscount) {
    return `${formattedPrice} ${configBus.strings[STRINGS.DISCOUNT].toLowerCase()}`;
  }

  return `${configBus.strings[STRINGS.FROM]} ${formattedPrice}`;
}
