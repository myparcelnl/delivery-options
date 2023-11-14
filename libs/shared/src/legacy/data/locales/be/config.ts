import {
  ALLOW_SATURDAY_DELIVERY,
  DEFAULT_MAX_PAGE_ITEMS,
  FEATURE_MAX_PAGE_ITEMS,
  FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW,
  FEATURE_PICKUP_SHOW_DISTANCE,
  FRIDAY_CUTOFF_TIME,
  LOCALE,
} from '../../keys';

export const config = {
  [LOCALE]: 'nl-BE',

  [ALLOW_SATURDAY_DELIVERY]: true,
  [FRIDAY_CUTOFF_TIME]: '15:00',

  /**
   * BE pickup location distance is not based on the customer's address but to the center of the city so the distance is
   *  mostly irrelevant.
   */
  [FEATURE_PICKUP_SHOW_DISTANCE]: false,

  /**
   * For the same reason as above, prefer the map view to the list view.
   */
  [FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW]: true,

  /**
   * Show more pickup items by default for BE because it doesn't show the distance.
   */
  [FEATURE_MAX_PAGE_ITEMS]: DEFAULT_MAX_PAGE_ITEMS,
};
