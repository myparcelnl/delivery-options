import * as CONFIG from '@/data/keys/configKeys';

/**
 * Permissions to enable delivery.
 *
 * @type {string[]}
 */
export const FEATURES_DELIVERY = [
  CONFIG.ALLOW_DELIVERY_OPTIONS,
  CONFIG.PRICE_STANDARD_DELIVERY,
];

/**
 * Permissions to enable evening delivery.
 *
 * @type {string[]}
 */
export const FEATURES_EVENING_DELIVERY = [
  CONFIG.ALLOW_EVENING_DELIVERY,
  CONFIG.PRICE_EVENING_DELIVERY,
];

/**
 * Permissions to enable monday delivery.
 *
 * @type {string[]}
 */
export const FEATURES_MONDAY_DELIVERY = [
  CONFIG.ALLOW_MONDAY_DELIVERY,
  CONFIG.SATURDAY_CUTOFF_TIME,
  CONFIG.SUNDAY_CUTOFF_TIME,
];

/**
 * Permissions to enable morning delivery.
 *
 * @type {string[]}
 */
export const FEATURES_MORNING_DELIVERY = [
  CONFIG.ALLOW_MORNING_DELIVERY,
  CONFIG.PRICE_MORNING_DELIVERY,
];

/**
 * Permissions to enable only recipient.
 *
 * @type {string[]}
 */
export const FEATURES_ONLY_RECIPIENT = [
  CONFIG.PRICE_ONLY_RECIPIENT,
  CONFIG.ALLOW_ONLY_RECIPIENT,
];

/**
 * Permissions to enable package type digital stamp.
 *
 * @type {string[]}
 */
export const FEATURES_PACKAGE_TYPE_DIGITAL_STAMP = [
  CONFIG.ALLOW_PACKAGE_TYPE_DIGITAL_STAMP,
];

/**
 * Permissions to enable package type mailbox.
 *
 * @type {string[]}
 */
export const FEATURES_PACKAGE_TYPE_MAILBOX = [
  CONFIG.ALLOW_PACKAGE_TYPE_MAILBOX,
];

/**
 * Permissions to enable package type packet.
 *
 * @type {string[]}
 */
export const FEATURES_PACKAGE_TYPE_PACKAGE_SMALL = [
  CONFIG.ALLOW_PACKAGE_TYPE_PACKAGE_SMALL,
];

/**
 * Permissions to enable pickup.
 *
 * @type {string[]}
 */
export const FEATURES_PICKUP = [
  CONFIG.ALLOW_PICKUP_LOCATIONS,
  CONFIG.PRICE_PICKUP,
];

/**
 * Permissions to enable saturday delivery.
 *
 * @type {string[]}
 */
export const FEATURES_SATURDAY_DELIVERY = [
  CONFIG.ALLOW_SATURDAY_DELIVERY,
  CONFIG.FRIDAY_CUTOFF_TIME,
];

/**
 * Permissions to enable signature.
 *
 * @type {string[]}
 */
export const FEATURES_SIGNATURE = [
  CONFIG.ALLOW_SIGNATURE,
  CONFIG.PRICE_SIGNATURE,
];

/**
 * Permission to show delivery date.
 *
 * @type {string[]}
 */
export const FEATURES_SHOW_DELIVERY_DATE = [
  CONFIG.FEATURE_SHOW_DELIVERY_DATE,
];

/**
 * Permission to show drop off days.
 *
 * @type {string[]}
 */
export const FEATURES_DROP_OFF_DAYS = [
  CONFIG.DROP_OFF_DAYS,
];

/**
 * Permission to show drop off delay.
 *
 * @type {string[]}
 */
export const FEATURES_DROP_OFF_DELAY = [
  CONFIG.DROP_OFF_DELAY,
];

/**
 * Permission to select number of delivery days in list.
 *
 * @type {string[]}
 */
export const FEATURES_DELIVERY_DAYS_WINDOW = [
  CONFIG.DELIVERY_DAYS_WINDOW,
];

/**
 * Permission to show cutoff time.
 *
 * @type {string[]}
 */
export const FEATURES_CUTOFF_TIME = [
  CONFIG.CUTOFF_TIME,
];

export const FEATURES_SATURDAY_CUTOFF_TIME = [
  CONFIG.SATURDAY_CUTOFF_TIME,
];

export const FEATURES_SUNDAY_CUTOFF_TIME = [
  CONFIG.SUNDAY_CUTOFF_TIME,
];

/**
 * Permission to have same day delivery.
 *
 * @type {string[]}
 */
export const FEATURES_SAME_DAY_DELIVERY = [
  CONFIG.PRICE_SAME_DAY_DELIVERY,
  CONFIG.ALLOW_SAME_DAY_DELIVERY,
  CONFIG.CUTOFF_TIME_SAME_DAY,
];
