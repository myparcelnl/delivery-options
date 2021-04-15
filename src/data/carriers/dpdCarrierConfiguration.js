import * as CONFIG from '@/data/keys/configKeys';
import * as countryCodes from '@/data/keys/countryCodes';
import { AbstractCarrierConfiguration } from '@/data/carriers/abstractCarrierConfiguration';

export class DpdCarrierConfiguration extends AbstractCarrierConfiguration {
  getCountriesForDelivery() {
    return [
      countryCodes.CC_AT,
      countryCodes.CC_BE,
      countryCodes.CC_BG,
      countryCodes.CC_CZ,
      countryCodes.CC_DE,
      countryCodes.CC_DK,
      countryCodes.CC_EE,
      countryCodes.CC_ES,
      countryCodes.CC_FI,
      countryCodes.CC_FR,
      countryCodes.CC_GR,
      countryCodes.CC_HU,
      countryCodes.CC_IE,
      countryCodes.CC_IT,
      countryCodes.CC_LI,
      countryCodes.CC_LT,
      countryCodes.CC_LU,
      countryCodes.CC_LV,
      countryCodes.CC_NL,
      countryCodes.CC_PL,
      countryCodes.CC_PT,
      countryCodes.CC_RO,
      countryCodes.CC_SE,
      countryCodes.CC_SI,
      countryCodes.CC_SK,
    ];
  }

  getCountriesForPickup() {
    return [
      countryCodes.CC_AT,
      countryCodes.CC_BE,
      countryCodes.CC_DE,
      countryCodes.CC_DK,
      countryCodes.CC_FI,
      countryCodes.CC_FR,
      countryCodes.CC_GB,
      countryCodes.CC_NL,
      countryCodes.CC_PT,
    ];
  }

  getDefaultConfig() {
    return {
      [CONFIG.ALLOW_MORNING_DELIVERY]: false,
      [CONFIG.ALLOW_EVENING_DELIVERY]: false,
      [CONFIG.ALLOW_MONDAY_DELIVERY]: false,
      [CONFIG.ALLOW_ONLY_RECIPIENT]: false,
    };
  }

  getFeatures() {
    return [
      CONFIG.ALLOW_DELIVERY_OPTIONS,
      CONFIG.ALLOW_PICKUP_LOCATIONS,
      CONFIG.PRICE_PICKUP,
      CONFIG.PRICE_STANDARD_DELIVERY,
    ];
  }
}
