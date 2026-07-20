import {toValue} from 'vue';
import {CarrierSetting, DELIVERY_DAYS_WINDOW_DEFAULT, type CarrierIdentifier} from '@myparcel-dev/do-shared';
import {type UseResolvedCarrier} from '../composables';

/**
 * Whether a carrier qualifies for a fallback delivery option: it received no
 * delivery moments from the API, has delivery, and shows delivery days. Callers
 * add their own representation-specific condition (standard or same-day support).
 */
export const isFallbackEligible = (
  carrier: UseResolvedCarrier,
  carriersWithMoments: ReadonlySet<CarrierIdentifier>,
): boolean => {
  const {identifier} = toValue(carrier.carrier);

  if (carriersWithMoments.has(identifier) || !toValue(carrier.hasDelivery)) {
    return false;
  }

  return carrier.get(CarrierSetting.DeliveryDaysWindow, DELIVERY_DAYS_WINDOW_DEFAULT) !== 0;
};
