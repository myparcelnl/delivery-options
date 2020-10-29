import * as STRINGS from '@/data/keys/stringsKeys';
import { formatCurrency } from '@/delivery-options/data/prices/formatCurrency';
import { getLowestPriceFromFormConfig } from '@/delivery-options/data/prices/getLowestPriceFromFormConfig';
import { configBus as realConfigBus } from '@/delivery-options/config/configBus';

/**
 * Create a price label from a form config object. Returns a string with "from x" or "x discount" based on the minimum
 *  price of all options in the given form config.
 *
 * @param {MyParcelDeliveryOptions.FormConfig} formSettings
 * @param {MyParcel.CarrierName} carrier
 * @param {import('@/delivery-options/config/configBus')} configBus - Optional parameter for easier testing.
 *
 * @returns {?String}
 */
export function getPriceLabelFromFormConfig(formSettings, carrier = null, configBus = realConfigBus) {
  const minimumPrice = getLowestPriceFromFormConfig(formSettings, carrier, configBus);
  const formattedPrice = formatCurrency(minimumPrice, configBus);
  const isDiscount = minimumPrice < 0;

  if (isDiscount) {
    return `${formattedPrice} ${configBus.strings[STRINGS.DISCOUNT].toLowerCase()}`;
  }

  return `${configBus.strings[STRINGS.FROM]} ${formattedPrice}`;
}
