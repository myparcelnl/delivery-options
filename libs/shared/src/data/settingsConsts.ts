import {PackageTypeName, PlatformName} from '@myparcel/constants';

export const PACKAGE_TYPE_DEFAULT = PackageTypeName.Package;

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
 * Pickup locations pagination
 */

export const DEFAULT_MAX_PAGE_ITEMS = 3;
