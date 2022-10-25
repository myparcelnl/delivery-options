import {Config} from '../../../delivery-options.types';

export const defaultConfigBe: Partial<Config> = {
  locale: 'nl-BE',

  allowSaturdayDelivery: true,
  // [CONFIG.FRIDAY_CUTOFF_TIME]: '15:00',

  /**
   * BE pickup location distance is not based on the customer's address but to the center of the city so the distance is
   *  mostly irrelevant.
   */
  pickupShowDistance: false,

  /**
   * For the same reason as above, prefer the map view to the list view.
   */
  pickupLocationsDefaultView: 'map',

  /**
   * Show more pickup items by default for BE because it doesn't show the distance.
   */
  // [CONFIG.FEATURE_MAX_PAGE_ITEMS]: DEFAULT_MAX_PAGE_ITEMS,
};
