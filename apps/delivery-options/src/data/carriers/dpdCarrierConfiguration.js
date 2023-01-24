import * as FEATURES from '@/data/carrierFeatures';
import { AbstractCarrierConfiguration } from '@/data/carriers/abstractCarrierConfiguration';
import { SENDMYPARCEL } from '@/data/keys/platformKeys';
import { countryCodes } from '@/data/keys/countryCodes';

export class DpdCarrierConfiguration extends AbstractCarrierConfiguration {
  getCountriesForDelivery() {
    return [
      countryCodes.AUSTRIA,
      countryCodes.BELGIUM,
      countryCodes.BULGARIA,
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
      countryCodes.LIECHTENSTEIN,
      countryCodes.LITHUANIA,
      countryCodes.LUXEMBOURG,
      countryCodes.NETHERLANDS,
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
      countryCodes.DENMARK,
      countryCodes.FINLAND,
      countryCodes.FRANCE,
      countryCodes.GERMANY,
      countryCodes.NETHERLANDS,
      countryCodes.PORTUGAL,
      countryCodes.UNITED_KINGDOM,
    ];
  }

  getFeatures() {
    return {
      [SENDMYPARCEL]: [
        FEATURES.FEATURES_DELIVERY,
        FEATURES.FEATURES_PICKUP,
        FEATURES.FEATURES_DROP_OFF_DAYS,
        FEATURES.FEATURES_DROP_OFF_DELAY,
        FEATURES.FEATURES_CUTOFF_TIME,
      ],
    };
  }
}
