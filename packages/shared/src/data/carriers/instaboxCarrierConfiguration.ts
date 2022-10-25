import * as FEATURES from '../carrierFeatures';
import {AbstractCarrierConfiguration, PlatformFeatures} from './abstractCarrierConfiguration';
import {COUNTRIES, PLATFORMS} from '@myparcel/sdk';

export class InstaboxCarrierConfiguration extends AbstractCarrierConfiguration {
  public getCountriesForDelivery(): string[] {
    return [
      COUNTRIES.NETHERLANDS,
    ];
  }

  public getCountriesForPickup(): string[] {
    return [];
  }

  public getFeatures(): PlatformFeatures {
    return {
      [PLATFORMS.MYPARCEL_NAME]: [
        FEATURES.FEATURES_CUTOFF_TIME,
        FEATURES.FEATURES_DELIVERY,
        FEATURES.FEATURES_DELIVERY_DAYS_WINDOW,
        FEATURES.FEATURES_DROP_OFF_DAYS,
        FEATURES.FEATURES_DROP_OFF_DELAY,
        FEATURES.FEATURES_ONLY_RECIPIENT,
        FEATURES.FEATURES_PACKAGE_TYPE_MAILBOX,
        FEATURES.FEATURES_SAME_DAY_DELIVERY,
        FEATURES.FEATURES_SHOW_DELIVERY_DATE,
      ],
    };
  }
}
