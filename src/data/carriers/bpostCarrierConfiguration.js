import * as CONFIG from '@/data/keys/configKeys';
import { AbstractCarrierConfiguration } from '@/data/carriers/abstractCarrierConfiguration';

export class BpostCarrierConfiguration extends AbstractCarrierConfiguration {
  getDefaultConfig() {
    return {
      [CONFIG.ALLOW_MORNING_DELIVERY]: false,
      [CONFIG.ALLOW_EVENING_DELIVERY]: false,
      [CONFIG.ALLOW_MONDAY_DELIVERY]: false,
      [CONFIG.ALLOW_ONLY_RECIPIENT]: false,
      [CONFIG.ALLOW_SIGNATURE]: false,
    };
  }

  getFeatures() {
    return [
      CONFIG.ALLOW_DELIVERY_OPTIONS,
      CONFIG.ALLOW_ONLY_RECIPIENT,
      CONFIG.ALLOW_PICKUP_LOCATIONS,
      CONFIG.ALLOW_SATURDAY_DELIVERY,
      CONFIG.ALLOW_SIGNATURE,
      CONFIG.PRICE_ONLY_RECIPIENT,
      CONFIG.PRICE_PICKUP,
      CONFIG.PRICE_SATURDAY_DELIVERY,
      CONFIG.PRICE_SIGNATURE,
      CONFIG.PRICE_STANDARD_DELIVERY,
      CONFIG.SATURDAY_CUTOFF_TIME,
    ];
  }
}
