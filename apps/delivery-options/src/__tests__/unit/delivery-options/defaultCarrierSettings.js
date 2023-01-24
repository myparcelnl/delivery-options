import {CONFIG} from '../../data';
import { POSTNL } from '../../data/keys/carrierKeys';

export const getDefaultCarrierSettings = (carrier = POSTNL) => ({
  [CONFIG.KEY]: {
    [CONFIG.CARRIER_SETTINGS]: {
      [carrier]: {
        [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
      },
    },
  },
});
