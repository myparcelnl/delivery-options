import * as CARRIERS from '@/data/keys/carrierKeys';
import * as CONFIG from '@/data/keys/configKeys';
import { DEFAULT_MAX_PAGE_ITEMS, DEFAULT_PRICE } from '@/data/keys/settingsConsts';
import { getDefaultCarrierConfig } from '@/delivery-options/data/carriers/getDefaultCarrierConfig';

export const config = {
  [CONFIG.LOCALE]: 'nl-BE',

  [CONFIG.ALLOW_SATURDAY_DELIVERY]: true,
  [CONFIG.PRICE_SATURDAY_DELIVERY]: DEFAULT_PRICE,
  [CONFIG.FRIDAY_CUTOFF_TIME]: '15:00',

  /**
   * BE pickup location distance is not based on the customer's address but to the center of the city so the distance is
   *  mostly irrelevant.
   */
  [CONFIG.FEATURE_PICKUP_SHOW_DISTANCE]: false,

  /**
   * For the same reason as above, prefer the map view to the list view.
   */
  [CONFIG.FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW]: true,

  /**
   * Show more pickup items by default for BE because it doesn't show the distance.
   */
  [CONFIG.FEATURE_MAX_PAGE_ITEMS]: DEFAULT_MAX_PAGE_ITEMS,

  [CONFIG.CARRIER_SETTINGS]: {
    ...getDefaultCarrierConfig(CARRIERS.BPOST),
    ...getDefaultCarrierConfig(CARRIERS.DPD),
    ...getDefaultCarrierConfig(CARRIERS.POSTNL, {
      [CONFIG.ALLOW_MONDAY_DELIVERY]: false,
      [CONFIG.ALLOW_SATURDAY_DELIVERY]: false,
      [CONFIG.ALLOW_MORNING_DELIVERY]: false,
      [CONFIG.ALLOW_EVENING_DELIVERY]: false,
    }),
  },
};
