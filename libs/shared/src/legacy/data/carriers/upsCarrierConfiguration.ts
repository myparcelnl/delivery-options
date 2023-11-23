import {
  AUSTRIA,
  BULGARIA,
  CROATIA,
  CZECH_REPUBLIC,
  ESTONIA,
  FINLAND,
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
} from '@myparcel/constants/countries';
import {type CarrierName, PlatformName} from '@myparcel/constants';
import {AddressField} from '../../../enums';
import {FEATURES_DELIVERY} from '../../../data/carrierFeatures';
import {AbstractCarrierConfiguration, type PlatformCarrierFeatures} from './abstractCarrierConfiguration';

export class UpsCarrierConfiguration extends AbstractCarrierConfiguration {
  public getCountriesForDelivery() {
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
    return [GERMANY];
  }

  public getDefaultRequestParameters(): AddressField[] {
    return [AddressField.PostalCode, AddressField.Street, AddressField.City];
  }

  public getFeatures(): PlatformCarrierFeatures {
    return {
      [PlatformName.MyParcel]: [FEATURES_DELIVERY],
    };
  }

  public getName(): CarrierName {
    return CarrierName.Ups;
  }

  public hasFakeDelivery(): boolean {
    return true;
  }
}
