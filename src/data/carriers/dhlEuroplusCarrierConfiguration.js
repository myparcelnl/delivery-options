import * as FEATURES from '@/data/carrierFeatures';
import { AbstractCarrierConfiguration } from '@/data/carriers/abstractCarrierConfiguration';
import { MYPARCEL } from '@/data/keys/platformKeys';
import { countryCodes } from '@/data/keys/countryCodes';

export class DhlEuroplusCarrierConfiguration extends AbstractCarrierConfiguration {
  getCountriesForDelivery() {
    return [
      countryCodes.BULGARIA,
      countryCodes.DENMARK,
      countryCodes.GERMANY,
      countryCodes.ESTONIA,
      countryCodes.FINLAND,
      countryCodes.FRANCE,
      countryCodes.GREECE,
      countryCodes.HUNGARY,
      countryCodes.IRELAND,
      countryCodes.ITALY,
      countryCodes.CROATIA,
      countryCodes.LATVIA,
      countryCodes.LITHUANIA,
      countryCodes.LUXEMBOURG,
      countryCodes.AUSTRIA,
      countryCodes.POLAND,
      countryCodes.PORTUGAL,
      countryCodes.ROMANIA,
      countryCodes.SLOVENIA,
      countryCodes.SLOVAKIA,
      countryCodes.SPAIN,
      countryCodes.CZECH_REPUBLIC,
      countryCodes.SWEDEN,
    ];
  }

  getCountriesForPickup() {
    return [];
  }

  getFeatures() {
    return {
      [MYPARCEL]: [
        FEATURES.FEATURES_CUTOFF_TIME,
        FEATURES.FEATURES_DELIVERY,
        FEATURES.FEATURES_DELIVERY_DAYS_WINDOW,
        FEATURES.FEATURES_DROP_OFF_DAYS,
        FEATURES.FEATURES_DROP_OFF_DELAY,
        FEATURES.FEATURES_SHOW_DELIVERY_DATE,
      ],
    };
  }
}
