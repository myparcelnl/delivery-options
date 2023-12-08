import {PackageTypeName, PlatformName} from '@myparcel/constants';

export const PACKAGE_TYPE_DEFAULT = PackageTypeName.Package;

export const DEFAULT_PRICE = 0;

export const PLATFORM_DEFAULT = PlatformName.MyParcel;
/*
 * Drop-off delay
 */

export const DROP_OFF_DELAY_MAX = 14;

export const DROP_OFF_DELAY_MIN = 0;

export const DROP_OFF_DELAY_DEFAULT = 1;

/*
 * Delivery days window
 */

export const DELIVERY_DAYS_WINDOW_MIN = 0;

export const DELIVERY_DAYS_WINDOW_MAX = 14;

export const DELIVERY_DAYS_WINDOW_DEFAULT = 7;

/*
 * Cutoff times
 */

export const CUTOFF_TIME_DEFAULT = '16:00';

export const CUTOFF_TIME_SAME_DAY_DEFAULT = '09:30';

/*
 * Pickup locations views
 */

export const PICKUP_LOCATIONS_VIEWS_LIST = 'list';

export const PICKUP_LOCATIONS_VIEWS_MAP = 'map';

export const PICKUP_LOCATIONS_VIEWS_DEFAULT = PICKUP_LOCATIONS_VIEWS_MAP;

/*
 * Pickup locations pagination
 */

export const PICKUP_MAX_PAGE_ITEMS_LIMIT = 20;

export const PICKUP_MIN_PAGE_ITEMS_LIMIT = 0;

export const DEFAULT_MAX_PAGE_ITEMS = 10;

export const END_OF_DAY_CUTOFF_TIME = '23:59';

export const PICKUP_LOCATIONS_VIEWS = [
  {
    text: 'pickup_locations.views.map',
    value: PICKUP_LOCATIONS_VIEWS_MAP,
  },
  {
    text: 'pickup_locations.views.list',
    value: PICKUP_LOCATIONS_VIEWS_LIST,
  },
];
