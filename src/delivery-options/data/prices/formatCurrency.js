import * as CONFIG from '@/data/keys/configKeys';
import { configBus as realConfigBus } from '@/delivery-options/config/configBus';

/**
 * @param {String|Number} price - Price config item or value.
 * @param {import('@/delivery-options/config/configBus')} configBus - Optional parameter for easier testing.
 *
 * @returns {String}
 */
export function formatCurrency(price, configBus = realConfigBus) {
  if (typeof price === 'string') {
    price = configBus.get(price, 'price');
  }

  const formatter = new Intl.NumberFormat(
    configBus.get(CONFIG.LOCALE),
    {
      style: 'currency',
      currency: configBus.get(CONFIG.CURRENCY),
    },
  );

  return formatter.format(Math.abs(price));
}
