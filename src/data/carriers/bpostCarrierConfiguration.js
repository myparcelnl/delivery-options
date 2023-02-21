import * as FEATURES from '@/data/carrierFeatures';
import { BELGIUM, NETHERLANDS } from '@myparcel/js-sdk/dist/constant/countries-iso2';
import { AbstractCarrierConfiguration } from '@/data/carriers/abstractCarrierConfiguration';
import { BPOST } from '../keys/carrierKeys';
import { SENDMYPARCEL } from '@/data/keys/platformKeys';

export class BpostCarrierConfiguration extends AbstractCarrierConfiguration {
  getName() {
    return BPOST;
  }

  /**
   * The countries this carrier can deliver to.
   *
   * @returns {string[]}
   */
  getCountriesForDelivery() {
    return [
      BELGIUM,
      NETHERLANDS,
    ];
  }

  /**
   * The countries this carrier can find pickup locations in.
   *
   * @returns {string[]}
   */
  getCountriesForPickup() {
    return [
      BELGIUM,
      NETHERLANDS,
    ];
  }

  getFeatures() {
    return {
      [SENDMYPARCEL]: [
        FEATURES.FEATURES_DELIVERY,
        FEATURES.FEATURES_PICKUP,
        FEATURES.FEATURES_SATURDAY_DELIVERY,
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
