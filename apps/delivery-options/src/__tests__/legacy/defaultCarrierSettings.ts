import {CONFIG, KEY_CONFIG, POSTNL} from '@myparcel-do/shared';

export const getDefaultCarrierSettings = (carrier = POSTNL) => ({
  [KEY_CONFIG]: {
    [CONFIG.CARRIER_SETTINGS]: {
      [carrier]: {
        [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
      },
    },
  },
});
