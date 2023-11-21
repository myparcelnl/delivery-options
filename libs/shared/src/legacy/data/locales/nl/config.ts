import {ALLOW_MONDAY_DELIVERY, LOCALE, SATURDAY_CUTOFF_TIME} from '../../../../data';

export const DEFAULT_LOCALE = 'nl-NL';

export const config = {
  [LOCALE]: DEFAULT_LOCALE,
  [ALLOW_MONDAY_DELIVERY]: true,
  [SATURDAY_CUTOFF_TIME]: '16:00',
};
