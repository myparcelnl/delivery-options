import * as CARRIERS from '@/data/keys/carrierKeys';
import * as CONFIG from '@/data/keys/configKeys';
import { getDefaultCarrierConfig } from '@/delivery-options/data/carriers/getDefaultCarrierConfig';

export const config = {
  [CONFIG.LOCALE]: 'nl-NL',
  [CONFIG.ALLOW_MONDAY_DELIVERY]: true,
  [CONFIG.SATURDAY_CUTOFF_TIME]: '16:00',

  [CONFIG.CARRIER_SETTINGS]: {
    ...getDefaultCarrierConfig(CARRIERS.POSTNL),
    ...getDefaultCarrierConfig(CARRIERS.RED_JE_PAKKETJE),
    ...getDefaultCarrierConfig(CARRIERS.CHEAP_CARGO),
  },
};
