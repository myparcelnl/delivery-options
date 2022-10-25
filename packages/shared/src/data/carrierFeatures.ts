import * as CONFIG from '../data/keys/configKeys';

export type FeatureSet = string[];

/**
 * Permissions to enable delivery.
 */
export const FEATURES_DELIVERY: FeatureSet = [
  CONFIG.ALLOW_DELIVERY_OPTIONS,
  CONFIG.PRICE_STANDARD_DELIVERY,
];

/**
 * Permissions to enable evening delivery.
 */
export const FEATURES_EVENING_DELIVERY: FeatureSet = [
  CONFIG.ALLOW_EVENING_DELIVERY,
  CONFIG.PRICE_EVENING_DELIVERY,
];

/**
 * Permissions to enable monday delivery.
 */
export const FEATURES_MONDAY_DELIVERY: FeatureSet = [
  CONFIG.ALLOW_MONDAY_DELIVERY,
  CONFIG.SATURDAY_CUTOFF_TIME,
];

/**
 * Permissions to enable morning delivery.
 */
export const FEATURES_MORNING_DELIVERY: FeatureSet = [
  CONFIG.ALLOW_MORNING_DELIVERY,
  CONFIG.PRICE_MORNING_DELIVERY,
];

/**
 * Permissions to enable only recipient.
 */
export const FEATURES_ONLY_RECIPIENT: FeatureSet = [
  CONFIG.PRICE_ONLY_RECIPIENT,
  CONFIG.ALLOW_ONLY_RECIPIENT,
];

/**
 * Permissions to enable package type digital stamp.
 */
export const FEATURES_PACKAGE_TYPE_DIGITAL_STAMP: FeatureSet = [
  CONFIG.ALLOW_PACKAGE_TYPE_DIGITAL_STAMP,
];

/**
 * Permissions to enable package type mailbox.
 */
export const FEATURES_PACKAGE_TYPE_MAILBOX: FeatureSet = [
  CONFIG.ALLOW_PACKAGE_TYPE_MAILBOX,
];

/**
 * Permissions to enable pickup.
 */
export const FEATURES_PICKUP: FeatureSet = [
  CONFIG.ALLOW_PICKUP_LOCATIONS,
  CONFIG.PRICE_PICKUP,
];

/**
 * Permissions to enable saturday delivery.
 */
export const FEATURES_SATURDAY_DELIVERY: FeatureSet = [
  CONFIG.ALLOW_SATURDAY_DELIVERY,
  CONFIG.FRIDAY_CUTOFF_TIME,
];

/**
 * Permissions to enable signature.
 */
export const FEATURES_SIGNATURE: FeatureSet = [
  CONFIG.ALLOW_SIGNATURE,
  CONFIG.PRICE_SIGNATURE,
];

/**
 * Permission to show delivery date.
 */
export const FEATURES_SHOW_DELIVERY_DATE: FeatureSet = [
  CONFIG.FEATURE_SHOW_DELIVERY_DATE,
];

/**
 * Permission to show drop off days.
 */
export const FEATURES_DROP_OFF_DAYS: FeatureSet = [
  CONFIG.DROP_OFF_DAYS,
];

/**
 * Permission to show drop off delay.
 */
export const FEATURES_DROP_OFF_DELAY: FeatureSet = [
  CONFIG.DROP_OFF_DELAY,
];

/**
 * Permission to select number of delivery days in list.
 */
export const FEATURES_DELIVERY_DAYS_WINDOW: FeatureSet = [
  CONFIG.DELIVERY_DAYS_WINDOW,
];

/**
 * Permission to show cutoff time.
 */
export const FEATURES_CUTOFF_TIME: FeatureSet = [
  CONFIG.CUTOFF_TIME,
];

/**
 * Permission to have same day delivery.
 */
export const FEATURES_SAME_DAY_DELIVERY: FeatureSet = [
  CONFIG.PRICE_SAME_DAY_DELIVERY,
  CONFIG.ALLOW_SAME_DAY_DELIVERY,
  CONFIG.CUTOFF_TIME_SAME_DAY,
];
