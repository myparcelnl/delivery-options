import {PACKAGE_TYPES, PLATFORMS, PackageTypeName} from '@myparcel/sdk';

export const DEFAULT_PLATFORM = PLATFORMS.MYPARCEL_NAME;

/**
 * @deprecated
 * @type {string}
 */
export const PACKAGE_TYPE_PACKAGE = 'package';

/**
 * @deprecated
 * @type {string}
 */
export const PACKAGE_TYPE_DIGITAL_STAMP = 'digital_stamp';

/**
 * @deprecated
 * @type {string}
 */
export const PACKAGE_TYPE_MAILBOX = 'mailbox';

export const DEFAULT_PACKAGE_TYPE = PACKAGE_TYPES.PACKAGE_NAME;

export const DEFAULT_DELIVERY_DAYS_WINDOW = 7;
export const DEFAULT_PRICE = 0;
export const DROP_OFF_DELAY_MAX = 14;
export const DROP_OFF_DELAY_MIN = 0;
export const PICKUP_MAX_PAGE_ITEMS_LIMIT = 20;
export const PICKUP_MIN_PAGE_ITEMS_LIMIT = 0;
export const DEFAULT_MAX_PAGE_ITEMS = 10;

export interface SelectOption<V extends string = string> {
  text: string;
  value: V;
}

export const PICKUP_LOCATIONS_VIEWS: SelectOption[] = [
  {
    text: 'pickup_locations.views.map',
    value: 'map',
  },
  {
    text: 'pickup_locations.views.list',
    value: 'list',
  },
];

export const PACKAGE_TYPE_OPTIONS: SelectOption<PackageTypeName>[] = [
  {
    text: 'package_types.package',
    value: PACKAGE_TYPES.PACKAGE_NAME,
  },
  {
    text: 'package_types.mailbox',
    value: PACKAGE_TYPES.MAILBOX_NAME,
  },
  {
    text: 'package_types.digital_stamp',
    value: PACKAGE_TYPES.DIGITAL_STAMP_NAME,
  },
];
