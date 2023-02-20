import * as FEATURES from '@/data/carrierFeatures';
import { AbstractCarrierConfiguration } from '@/data/carriers/abstractCarrierConfiguration';
import { DHL_FOR_YOU } from '../keys/carrierKeys';
import { MYPARCEL } from '@/data/keys/platformKeys';
import { countryCodes } from '@/data/keys/countryCodes';

export class DhlForYouCarrierConfiguration extends AbstractCarrierConfiguration {
  getName() {
    return DHL_FOR_YOU;
  }

  getCountriesForDelivery() {
    return [
      countryCodes.NETHERLANDS,
    ];
  }

  getCountriesForPickup() {
    return [
      countryCodes.NETHERLANDS,
    ];
  }

  getFeatures() {
    return {
      [MYPARCEL]: [
        FEATURES.FEATURES_CUTOFF_TIME,
        FEATURES.FEATURES_DELIVERY,
        FEATURES.FEATURES_DELIVERY_DAYS_WINDOW,
        FEATURES.FEATURES_DROP_OFF_DAYS,
        FEATURES.FEATURES_DROP_OFF_DELAY,
        FEATURES.FEATURES_SAME_DAY_DELIVERY,
        FEATURES.FEATURES_SHOW_DELIVERY_DATE,
        FEATURES.FEATURES_PICKUP,
        FEATURES.FEATURES_ONLY_RECIPIENT,
        FEATURES.FEATURES_SIGNATURE,
      ],
    };
  }
}
