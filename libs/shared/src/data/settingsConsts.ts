import {PackageTypeName} from '@myparcel/constants';

export const PACKAGE_TYPE_PACKAGE = PackageTypeName.Package;

export const PACKAGE_TYPE_DIGITAL_STAMP = PackageTypeName.DigitalStamp;

export const PACKAGE_TYPE_MAILBOX = PackageTypeName.Mailbox;

export const DEFAULT_PACKAGE_TYPE = PACKAGE_TYPE_PACKAGE;

export const DEFAULT_DELIVERY_DAYS_WINDOW = 7;

export const DEFAULT_PRICE = 0;

export const DROP_OFF_DELAY_MAX = 14;

export const DROP_OFF_DELAY_MIN = 0;

export const PICKUP_MAX_PAGE_ITEMS_LIMIT = 20;

export const PICKUP_MIN_PAGE_ITEMS_LIMIT = 0;

export const DEFAULT_MAX_PAGE_ITEMS = 10;

export const END_OF_DAY_CUTOFF_TIME = '23:59';

export const PICKUP_LOCATIONS_VIEWS = [
  {
    text: 'pickup_locations.views.map',
    value: 'map',
  },
  {
    text: 'pickup_locations.views.list',
    value: 'list',
  },
];

export const PACKAGE_TYPE_OPTIONS = [
  {
    text: 'package_types.package',
    value: PACKAGE_TYPE_PACKAGE,
  },
  {
    text: 'package_types.mailbox',
    value: PACKAGE_TYPE_MAILBOX,
  },
  {
    text: 'package_types.digital_stamp',
    value: PACKAGE_TYPE_DIGITAL_STAMP,
  },
];