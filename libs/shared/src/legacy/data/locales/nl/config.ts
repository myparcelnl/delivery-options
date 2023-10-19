import * as CONFIG from '@/data/keys/configKeys';

export const DEFAULT_LOCALE = 'nl-NL';

export const config = {
  [CONFIG.LOCALE]: DEFAULT_LOCALE,
  [CONFIG.ALLOW_MONDAY_DELIVERY]: true,
  [CONFIG.SATURDAY_CUTOFF_TIME]: '16:00',
};
