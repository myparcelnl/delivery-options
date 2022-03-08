import * as CONFIG from '@/data/keys/configKeys';
import { hasSameDayDelivery } from '@/helpers/delivery/hasSameDayDelivery';
import { configBus as realConfigBus } from '@/delivery-options/config/configBus';

/**
 * @param {import('@/delivery-options/config/configBus').configBus} configBus - Optional parameter for easier testing.
 *
 * @returns {Partial<DeliveryOptionsRequestParameters>}
 */
export function getDropOffDelayParameter(configBus = realConfigBus) {
  if (!configBus.isEnabled(CONFIG.ALLOW_SAME_DAY_DELIVERY)) {
    return {};
  }

  return {
    dropoff_delay: hasSameDayDelivery() ? 0 : 1,
  };
}
