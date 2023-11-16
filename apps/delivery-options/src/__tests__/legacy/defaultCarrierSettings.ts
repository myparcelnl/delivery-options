import {CONFIG, KEY_CONFIG} from '@myparcel-do/shared';
import {CarrierName} from '@myparcel/constants';

export const getDefaultCarrierSettings = (carrier = CarrierName.PostNl) => ({
  [KEY_CONFIG]: {
    [CONFIG.CARRIER_SETTINGS]: {
      [carrier]: {
        [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
      },
    },
  },
});
