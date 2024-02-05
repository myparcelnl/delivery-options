import * as FEATURES from '@/data/carrierFeatures';
import { BELGIUM, NETHERLANDS } from '@myparcel/js-sdk/dist/constant/countries-iso2';
import { CITY, POSTAL_CODE, STREET } from '../keys/addressKeys';
import { MYPARCEL, SENDMYPARCEL } from '@/data/keys/platformKeys';
import { AbstractCarrierConfiguration } from '@/data/carriers/abstractCarrierConfiguration';
import { POSTNL } from '../keys/carrierKeys';

export class PostNlCarrierConfiguration extends AbstractCarrierConfiguration {
  getName() {
    return POSTNL;
  }

  getDefaultRequestParameters() {
    return [POSTAL_CODE, STREET, CITY];
  }

  getCountriesForDelivery() {
    return [NETHERLANDS, BELGIUM];
  }

  hasFakeDelivery() {
    return true;
  }

  getCountriesForPickup() {
    return [
      BELGIUM,
      NETHERLANDS,
    ];
  }

  getFeatures() {
    return {
      [MYPARCEL]: [
        FEATURES.FEATURES_DELIVERY,
        FEATURES.FEATURES_EVENING_DELIVERY,
        FEATURES.FEATURES_MORNING_DELIVERY,
        FEATURES.FEATURES_ONLY_RECIPIENT,
        FEATURES.FEATURES_PACKAGE_TYPE_DIGITAL_STAMP,
        FEATURES.FEATURES_PACKAGE_TYPE_MAILBOX,
        FEATURES.FEATURES_PACKAGE_TYPE_PACKET,
        FEATURES.FEATURES_MONDAY_DELIVERY,
        FEATURES.FEATURES_PICKUP,
        FEATURES.FEATURES_SIGNATURE,
        FEATURES.FEATURES_SHOW_DELIVERY_DATE,
        FEATURES.FEATURES_DELIVERY_DAYS_WINDOW,
        FEATURES.FEATURES_DROP_OFF_DAYS,
        FEATURES.FEATURES_DROP_OFF_DELAY,
        FEATURES.FEATURES_CUTOFF_TIME,
      ],
      [SENDMYPARCEL]: [
        FEATURES.FEATURES_DELIVERY,
        FEATURES.FEATURES_ONLY_RECIPIENT,
        FEATURES.FEATURES_PICKUP,
        FEATURES.FEATURES_SIGNATURE,
        FEATURES.FEATURES_SHOW_DELIVERY_DATE,
        FEATURES.FEATURES_DELIVERY_DAYS_WINDOW,
        FEATURES.FEATURES_DROP_OFF_DAYS,
        FEATURES.FEATURES_DROP_OFF_DELAY,
        FEATURES.FEATURES_CUTOFF_TIME,
      ],
    };
  }
}
