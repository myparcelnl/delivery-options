import {isPastTime} from '@myparcel-dev/do-shared';
import {type UseResolvedCarrier} from '../composables';
import {supportsSameDay} from './supportsSameDay';
import {calculateCutoffTime} from './calculateCutoffTime';

/**
 * Whether same-day delivery can be offered for delivery on today itself: the
 * carrier supports it and the same-day cutoff time has not passed. The cutoff
 * comes from today's drop-off day entry when present, falling back to the
 * flat cutoffTimeSameDay setting.
 */
export const isSameDayAvailable = (carrier: UseResolvedCarrier): boolean => {
  if (!supportsSameDay(carrier)) {
    return false;
  }

  // calculateCutoffTime returns the same-day cutoff for same-day capable carriers.
  return !isPastTime(calculateCutoffTime(carrier));
};
