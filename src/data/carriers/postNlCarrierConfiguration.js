import * as FEATURES from '@/data/carrierFeatures';
import { MYPARCEL, SENDMYPARCEL } from '@/data/keys/platformKeys';
import { AbstractCarrierConfiguration } from '@/data/carriers/abstractCarrierConfiguration';

export class PostNlCarrierConfiguration extends AbstractCarrierConfiguration {
  getFeatures() {
    return {
      [MYPARCEL]: [
        FEATURES.FEATURES_DELIVERY,
        FEATURES.FEATURES_EVENING_DELIVERY,
        FEATURES.FEATURES_MORNING_DELIVERY,
        FEATURES.FEATURES_ONLY_RECIPIENT,
        FEATURES.FEATURES_PACKAGE_TYPE_DIGITAL_STAMP,
        FEATURES.FEATURES_PACKAGE_TYPE_MAILBOX,
        FEATURES.FEATURES_MONDAY_DELIVERY,
        FEATURES.FEATURES_PICKUP,
        FEATURES.FEATURES_SIGNATURE,
        FEATURES.FEATURES_SHOW_DELIVERY_DATE,
      ],
      [SENDMYPARCEL]: [
        FEATURES.FEATURES_DELIVERY,
        FEATURES.FEATURES_ONLY_RECIPIENT,
        FEATURES.FEATURES_PICKUP,
        FEATURES.FEATURES_SIGNATURE,
        FEATURES.FEATURES_SHOW_DELIVERY_DATE,
      ],
    };
  }
}