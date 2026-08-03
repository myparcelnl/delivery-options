import {toValue} from 'vue';
import {CustomDeliveryType} from '@myparcel-dev/do-shared';
import {type UseResolvedCarrier} from '../composables';

/**
 * Whether this carrier offers same-day delivery: available in its capabilities
 * and enabled in the config. Ignores the cutoff time; that only matters when
 * the delivery day is today (see isSameDayAvailable).
 */
export const supportsSameDay = (carrier: UseResolvedCarrier): boolean =>
  toValue(carrier.deliveryTypes).has(CustomDeliveryType.SameDay);
