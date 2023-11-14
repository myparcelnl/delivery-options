import {CONFIG} from '@myparcel-do/shared';

export const formatCurrency = (price, configBus = realConfigBus) => {
  if (typeof price !== 'number') {
    throw new Error('"price" must be a number.');
  }

  const formatter = new Intl.NumberFormat(configBus.get(CONFIG.LOCALE), {
    style: 'currency',
    currency: configBus.get(CONFIG.CURRENCY),
  });

  return formatter.format(Math.abs(price));
};
