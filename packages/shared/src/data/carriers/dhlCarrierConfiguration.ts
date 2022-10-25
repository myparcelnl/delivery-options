import * as FEATURES from '../../data/carrierFeatures';
import {AbstractCarrierConfiguration, PlatformFeatures} from './abstractCarrierConfiguration';
import {COUNTRIES, PLATFORMS} from '@myparcel/sdk';

export class DhlCarrierConfiguration extends AbstractCarrierConfiguration {
  public getCountriesForDelivery(): string[] {
    return [
      COUNTRIES.AUSTRIA,
      COUNTRIES.BULGARIA,
      COUNTRIES.CROATIA,
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
      COUNTRIES.LITHUANIA,
      COUNTRIES.POLAND,
      COUNTRIES.PORTUGAL,
      COUNTRIES.ROMANIA,
      COUNTRIES.SLOVAKIA,
      COUNTRIES.SLOVENIA,
      COUNTRIES.SPAIN,
      COUNTRIES.SWEDEN,
    ];
  }

  public getCountriesForPickup(): string[] {
    return [
      COUNTRIES.AUSTRIA,
      COUNTRIES.BELGIUM,
      COUNTRIES.GERMANY,
      COUNTRIES.DENMARK,
      COUNTRIES.FINLAND,
      COUNTRIES.FRANCE,
      COUNTRIES.UNITED_KINGDOM,
      COUNTRIES.PORTUGAL,
    ];
  }

  public getFeatures(): PlatformFeatures {
    return {
      [PLATFORMS.MYPARCEL_NAME]: [
        FEATURES.FEATURES_DELIVERY,
        FEATURES.FEATURES_PICKUP,
        FEATURES.FEATURES_SHOW_DELIVERY_DATE,
      ],
    };
  }
}
