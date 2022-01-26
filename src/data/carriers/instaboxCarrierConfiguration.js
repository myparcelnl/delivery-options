import * as FEATURES from '@/data/carrierFeatures';
import { AbstractCarrierConfiguration } from '@/data/carriers/abstractCarrierConfiguration';
import { MYPARCEL } from '@/data/keys/platformKeys';
import { countryCodes } from '@/data/keys/countryCodes';

export class InstaboxCarrierConfiguration extends AbstractCarrierConfiguration {
  getCountriesForDelivery() {
    return [
      countryCodes.NETHERLANDS,
    ];
  }

  getCountriesForPickup() {
    return [];
  }

  getFeatures() {
    return {
      [MYPARCEL]: [
        FEATURES.FEATURES_ONLY_RECIPIENT,
        FEATURES.FEATURES_DELIVERY,
        FEATURES.FEATURES_PACKAGE_TYPE_MAILBOX,
        FEATURES.FEATURES_SHOW_DELIVERY_DATE,
        FEATURES.FEATURES_DELIVERY_DAYS_WINDOW,
        FEATURES.FEATURES_DROP_OFF_DAYS,
        FEATURES.FEATURES_DROP_OFF_DELAY,
        FEATURES.FEATURES_CUTOFF_TIME,
      ],
    };
  }
}
