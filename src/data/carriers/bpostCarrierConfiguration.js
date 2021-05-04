import * as FEATURES from '@/data/carrierFeatures';
import { AbstractCarrierConfiguration } from '@/data/carriers/abstractCarrierConfiguration';
import { SENDMYPARCEL } from '@/data/keys/platformKeys';

export class BpostCarrierConfiguration extends AbstractCarrierConfiguration {
  getFeatures() {
    return {
      [SENDMYPARCEL]: [
        FEATURES.FEATURES_DELIVERY,
        FEATURES.FEATURES_PICKUP,
        FEATURES.FEATURES_SATURDAY_DELIVERY,
        FEATURES.FEATURES_SIGNATURE,
      ],
    };
  }
}
