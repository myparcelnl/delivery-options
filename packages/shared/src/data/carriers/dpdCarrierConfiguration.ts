import * as FEATURES from '../../data/carrierFeatures';
import {AbstractCarrierConfiguration, PlatformFeatures} from './abstractCarrierConfiguration';
import {COUNTRIES, PLATFORMS} from '@myparcel/sdk';

export class DpdCarrierConfiguration extends AbstractCarrierConfiguration {
  public getCountriesForDelivery(): string[] {
    return [
      COUNTRIES.AUSTRIA,
      COUNTRIES.BELGIUM,
      COUNTRIES.BULGARIA,
      COUNTRIES.CZECH_REPUBLIC,
      COUNTRIES.DENMARK,
      COUNTRIES.ESTONIA,
      COUNTRIES.FINLAND,
      COUNTRIES.FRANCE,
      COUNTRIES.GERMANY,
      COUNTRIES.GREECE,
      COUNTRIES.HUNGARY,
      COUNTRIES.IRELAND,
      COUNTRIES.ITALY,
      COUNTRIES.LATVIA,
      COUNTRIES.LIECHTENSTEIN,
      COUNTRIES.LITHUANIA,
      COUNTRIES.LUXEMBOURG,
      COUNTRIES.NETHERLANDS,
      COUNTRIES.POLAND,
      COUNTRIES.PORTUGAL,
      COUNTRIES.ROMANIA,
      COUNTRIES.SLOVAKIA,
      COUNTRIES.SLOVENIA,
      COUNTRIES.SPAIN,
      COUNTRIES.SWEDEN,
    ];
  }

  getCountriesForPickup() {
    return [
      COUNTRIES.AUSTRIA,
      COUNTRIES.BELGIUM,
      COUNTRIES.DENMARK,
      COUNTRIES.FINLAND,
      COUNTRIES.FRANCE,
      COUNTRIES.GERMANY,
      COUNTRIES.NETHERLANDS,
      COUNTRIES.PORTUGAL,
      COUNTRIES.UNITED_KINGDOM,
    ];
  }

  public getFeatures(): PlatformFeatures {
    return {
      [PLATFORMS.SENDMYPARCEL_NAME]: [
        FEATURES.FEATURES_DELIVERY,
        FEATURES.FEATURES_PICKUP,
        FEATURES.FEATURES_DROP_OFF_DAYS,
        FEATURES.FEATURES_DROP_OFF_DELAY,
        FEATURES.FEATURES_CUTOFF_TIME,
      ],
    };
  }
}
