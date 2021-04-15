import * as CONFIG from '@/data/keys/configKeys';
import * as countryCodes from '@/data/keys/countryCodes';
import { AbstractCarrierConfiguration } from '@/data/carriers/abstractCarrierConfiguration';

export class RedJePakketjeCarrierConfiguration extends AbstractCarrierConfiguration {
  getCountriesForDelivery() {
    return [
      countryCodes.CC_NL,
    ];
  }

  getCountriesForPickup() {
    return [];
  }

  getFeatures() {
    return [
      CONFIG.ALLOW_DELIVERY_OPTIONS,
      CONFIG.ALLOW_ONLY_RECIPIENT,
      CONFIG.ALLOW_PICKUP_LOCATIONS,
      CONFIG.PRICE_ONLY_RECIPIENT,
      CONFIG.PRICE_PICKUP,
      CONFIG.PRICE_STANDARD_DELIVERY,
    ];
  }
}
