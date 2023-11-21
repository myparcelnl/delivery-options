import {
  AUSTRIA,
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
import {FEATURES_DELIVERY, FEATURES_PICKUP} from '../../../data/carrierFeatures';
import {AbstractCarrierConfiguration, type PlatformCarrierFeatures} from './abstractCarrierConfiguration';

export class DhlParcelConnectCarrierConfiguration extends AbstractCarrierConfiguration {
  public getCountriesForDelivery(): string[] {
    return [
      BULGARIA,
      GERMANY,
      ESTONIA,
      FINLAND,
      GREECE,
      HUNGARY,
      IRELAND,
      ITALY,
      CROATIA,
      LATVIA,
      LITHUANIA,
      LUXEMBOURG,
      AUSTRIA,
      POLAND,
      PORTUGAL,
      ROMANIA,
      SLOVENIA,
      SLOVAKIA,
      SPAIN,
      CZECH_REPUBLIC,
    ];
  }

  public getCountriesForPickup(): string[] {
    return [
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

  public getFeatures(): PlatformCarrierFeatures {
    return {
      [PlatformName.MyParcel]: [FEATURES_DELIVERY, FEATURES_PICKUP],
    };
  }

  public getName(): CarrierName {
    return CarrierName.DhlParcelConnect;
  }
}
