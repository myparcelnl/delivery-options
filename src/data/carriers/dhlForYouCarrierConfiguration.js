import * as FEATURES from '@/data/carrierFeatures';
import { BELGIUM, NETHERLANDS } from '@myparcel/js-sdk/dist/constant/countries-iso2';
import { CITY, POSTAL_CODE } from '../keys/addressKeys';
import { AbstractCarrierConfiguration } from '@/data/carriers/abstractCarrierConfiguration';
import { DHL_FOR_YOU } from '../keys/carrierKeys';
import { MYPARCEL } from '@/data/keys/platformKeys';

export class DhlForYouCarrierConfiguration extends AbstractCarrierConfiguration {
  getName() {
    return DHL_FOR_YOU;
  }

  getDefaultRequestParameters() {
    return [CITY, POSTAL_CODE];
  }

  getCountriesForDelivery() {
    return [
      NETHERLANDS,
      BELGIUM,
    ];
  }

  getCountriesForPickup() {
    return [
      NETHERLANDS,
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
        // FEATURES.FEATURES_SHOW_DELIVERY_DATE,
        FEATURES.FEATURES_PICKUP,
        FEATURES.FEATURES_ONLY_RECIPIENT,
        FEATURES.FEATURES_SIGNATURE,
        FEATURES.FEATURES_PACKAGE_TYPE_PACKAGE_SMALL,
      ],
    };
  }
}
