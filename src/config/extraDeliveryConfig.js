import * as CONFIG from '@/data/keys/configKeys';
import { MYPARCEL, SENDMYPARCEL } from '@/data/keys/platformKeys';

const MONDAY = 1;
const FRIDAY = 5;
const SATURDAY = 6;

/**
 * Settings for extra delivery days.
 *
 * @type {Object[]}
 */
export const extraDeliveryConfig = [
  {
    deliveryDay: MONDAY,
    dropOffDay: SATURDAY,
    platforms: [MYPARCEL],
    requires: [
      CONFIG.ALLOW_MONDAY_DELIVERY,
      CONFIG.SATURDAY_CUTOFF_TIME,
    ],
    cutoffTime: CONFIG.SATURDAY_CUTOFF_TIME,
  },
  {
    deliveryDay: SATURDAY,
    dropOffDay: FRIDAY,
    platforms: [SENDMYPARCEL],
    requires: [
      CONFIG.ALLOW_SATURDAY_DELIVERY,
      CONFIG.FRIDAY_CUTOFF_TIME,
    ],
    cutoffTime: CONFIG.FRIDAY_CUTOFF_TIME,
  },
];
