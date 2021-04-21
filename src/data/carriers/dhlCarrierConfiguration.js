import * as FEATURES from '@/data/carrierFeatures';
import { AbstractCarrierConfiguration } from '@/data/carriers/abstractCarrierConfiguration';
import { MYPARCEL } from '@/data/keys/platformKeys';
import { countryCodes } from '@/data/keys/countryCodes';

export class DhlCarrierConfiguration extends AbstractCarrierConfiguration {
  getCountriesForDelivery() {
    return [
      countryCodes.AUSTRIA,
      countryCodes.BULGARIA,
      countryCodes.CROATIA,
      countryCodes.CZECH_REPUBLIC,
      countryCodes.DENMARK,
      countryCodes.ESTONIA,
      countryCodes.FINLAND,
      countryCodes.FRANCE,
      countryCodes.GERMANY,
      countryCodes.GREECE,
      countryCodes.HUNGARY,
      countryCodes.IRELAND,
      countryCodes.ITALY,
      countryCodes.LATVIA,
      countryCodes.LITHUANIA,
      countryCodes.POLAND,
      countryCodes.PORTUGAL,
      countryCodes.ROMANIA,
      countryCodes.SLOVAKIA,
      countryCodes.SLOVENIA,
      countryCodes.SPAIN,
      countryCodes.SWEDEN,
    ];
  }

  getCountriesForPickup() {
    return [
      countryCodes.AUSTRIA,
      countryCodes.BELGIUM,
      countryCodes.GERMANY,
      countryCodes.DENMARK,
      countryCodes.FINLAND,
      countryCodes.FRANCE,
      countryCodes.UNITED_KINGDOM,
      countryCodes.PORTUGAL,
    ];
  }

  getFeatures() {
    return {
      [MYPARCEL]: [
        FEATURES.FEATURES_DELIVERY,
        FEATURES.FEATURES_PICKUP,
      ],
    };
  }
}
