import * as CONFIG from '@/data/keys/configKeys';
import { POSTNL } from '@/data/keys/carrierKeys';

export const getDefaultCarrierSettings = (carrier = POSTNL) => ({
  [CONFIG.KEY]: {
    [CONFIG.CARRIER_SETTINGS]: {
      [carrier]: {
        [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
      },
    },
  },
});
