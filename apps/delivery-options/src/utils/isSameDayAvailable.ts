import {toValue} from 'vue';
import {CustomDeliveryType, isPastTime} from '@myparcel-dev/do-shared';
import {type UseResolvedCarrier} from '../composables';
import {calculateCutoffTime} from './calculateCutoffTime';

/**
 * Whether same-day delivery can currently be offered for this carrier:
 * available in its capabilities, enabled in the config, and before the
 * carrier's same-day cutoff time. The cutoff comes from today's drop-off day
 * entry when present, falling back to the flat cutoffTimeSameDay setting.
 */
export const isSameDayAvailable = (carrier: UseResolvedCarrier): boolean => {
  if (!toValue(carrier.deliveryTypes).has(CustomDeliveryType.SameDay)) {
    return false;
  }

  // calculateCutoffTime returns the same-day cutoff for same-day capable carriers.
  return !isPastTime(calculateCutoffTime(carrier));
};
