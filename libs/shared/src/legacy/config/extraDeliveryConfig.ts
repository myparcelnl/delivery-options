import {FEATURES_MONDAY_DELIVERY, FEATURES_SATURDAY_DELIVERY, FRIDAY_CUTOFF_TIME, SATURDAY_CUTOFF_TIME} from '../data';

export const MONDAY = 1;

export const TUESDAY = 2;

export const WEDNESDAY = 3;

export const THURSDAY = 4;

export const FRIDAY = 5;

export const SATURDAY = 6;

export const SUNDAY = 0;

/**
 * Settings for extra delivery days.
 *
 * @type {Object[]}
 */
export const extraDeliveryConfig = [
  {
    cutoffTime: SATURDAY_CUTOFF_TIME,
    deliveryDay: MONDAY,
    dropOffDay: SATURDAY,
    requires: FEATURES_MONDAY_DELIVERY,
  },
  {
    cutoffTime: FRIDAY_CUTOFF_TIME,
    deliveryDay: SATURDAY,
    dropOffDay: FRIDAY,
    requires: FEATURES_SATURDAY_DELIVERY,
  },
];
