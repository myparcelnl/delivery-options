import * as countryCodes from '@/data/keys/countryCodes';
import { AbstractCarrierConfiguration } from '@/data/carriers/abstractCarrierConfiguration';

export class DhlCarrierConfiguration extends AbstractCarrierConfiguration {
  getCountriesForDelivery() {
    return [
      countryCodes.CC_AT,
      countryCodes.CC_BG,
      countryCodes.CC_CZ,
      countryCodes.CC_DE,
      countryCodes.CC_DK,
      countryCodes.CC_EE,
      countryCodes.CC_ES,
      countryCodes.CC_FI,
      countryCodes.CC_FR,
      countryCodes.CC_GR,
      countryCodes.CC_HR,
      countryCodes.CC_HU,
      countryCodes.CC_IE,
      countryCodes.CC_IT,
      countryCodes.CC_LT,
      countryCodes.CC_LV,
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
      countryCodes.CC_CZ,
      countryCodes.CC_DE,
      countryCodes.CC_DK,
      countryCodes.CC_EE,
      countryCodes.CC_ES,
      countryCodes.CC_FI,
      countryCodes.CC_FR,
      countryCodes.CC_GB,
      countryCodes.CC_HU,
      countryCodes.CC_IE,
      countryCodes.CC_LT,
      countryCodes.CC_LU,
      countryCodes.CC_LV,
      countryCodes.CC_NL,
      countryCodes.CC_PL,
      countryCodes.CC_PT,
      countryCodes.CC_SE,
      countryCodes.CC_SI,
      countryCodes.CC_SK,
    ];
  }
}
