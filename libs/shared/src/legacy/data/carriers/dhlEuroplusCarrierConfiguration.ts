import {
  AUSTRIA,
  BELGIUM,
  BULGARIA,
  CROATIA,
  CZECH_REPUBLIC,
  DENMARK,
  ESTONIA,
  FINLAND,
  FRANCE,
  GERMANY,
  GREECE,
  HUNGARY,
  IRELAND,
  ITALY,
  LATVIA,
  LITHUANIA,
  LUXEMBOURG,
  NETHERLANDS,
  POLAND,
  PORTUGAL,
  ROMANIA,
  SLOVAKIA,
  SLOVENIA,
  SPAIN,
  SWEDEN,
  UNITED_KINGDOM,
} from '@myparcel/constants/countries';
import {type CarrierName, PlatformName} from '@myparcel/constants';
import {FEATURES_DELIVERY} from '../carrierFeatures';
import {AbstractCarrierConfiguration, type PlatformCarrierFeatures} from './abstractCarrierConfiguration';

export class DhlEuroplusCarrierConfiguration extends AbstractCarrierConfiguration {
  public getCountriesForDelivery(): string[] {
    return [
      BELGIUM,
      BULGARIA,
      DENMARK,
      GERMANY,
      ESTONIA,
      FINLAND,
      FRANCE,
      GREECE,
      HUNGARY,
      IRELAND,
      ITALY,
      CROATIA,
      LATVIA,
      LITHUANIA,
      LUXEMBOURG,
      NETHERLANDS,
      AUSTRIA,
      POLAND,
      PORTUGAL,
      ROMANIA,
      SLOVENIA,
      SLOVAKIA,
      SPAIN,
      CZECH_REPUBLIC,
      SWEDEN,
      UNITED_KINGDOM,
    ];
  }

  public getCountriesForPickup(): string[] {
    return [];
  }

  public getFeatures(): PlatformCarrierFeatures {
    return {
      [PlatformName.MyParcel as const]: [FEATURES_DELIVERY],
    };
  }

  public getName(): CarrierName {
    return CarrierName.DhlEuroPlus as const;
  }
}
