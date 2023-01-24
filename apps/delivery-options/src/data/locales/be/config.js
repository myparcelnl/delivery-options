import { CONFIG } from '../../../data';
import { DEFAULT_MAX_PAGE_ITEMS } from '../../keys';

export const config = {
  [CONFIG.LOCALE]: 'nl-BE',

  [CONFIG.ALLOW_SATURDAY_DELIVERY]: true,
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
};
