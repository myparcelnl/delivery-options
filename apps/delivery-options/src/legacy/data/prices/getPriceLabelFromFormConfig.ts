import {CONFIG, STRINGS} from '@myparcel-do/shared';
import {type CarrierName} from '@myparcel/constants';
import {getLowestPriceFromFormConfig} from './getLowestPriceFromFormConfig';
import {formatCurrency} from './formatCurrency';

/**
 * Create a price label from a form config object. Returns a string with "from x" or "x discount" based on the minimum
 *  price of all options in the given form config.
 */
export function getPriceLabelFromFormConfig(formSettings, carrier?: CarrierName, configBus = realConfigBus) {
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
