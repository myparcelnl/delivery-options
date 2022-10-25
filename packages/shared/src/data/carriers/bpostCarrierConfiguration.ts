import * as FEATURES from '../carrierFeatures';
import {AbstractCarrierConfiguration, PlatformFeatures} from './abstractCarrierConfiguration';
import {PLATFORMS} from '@myparcel/sdk';

export class BpostCarrierConfiguration extends AbstractCarrierConfiguration {
  public getFeatures(): PlatformFeatures {
    return {
      [PLATFORMS.SENDMYPARCEL_NAME]: [
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
