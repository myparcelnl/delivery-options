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
import {type CarrierName} from '@myparcel/constants';
import {ADDRESS_CITY, ADDRESS_POSTAL_CODE, ADDRESS_STREET, MYPARCEL, UPS} from '../keys';
import {FEATURES_DELIVERY} from '../carrierFeatures';
import {type AddressField} from '../../../types';
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
    return [ADDRESS_POSTAL_CODE, ADDRESS_STREET, ADDRESS_CITY];
  }

  public getFeatures(): PlatformCarrierFeatures {
    return {
      [MYPARCEL]: [FEATURES_DELIVERY],
    };
  }

  public getName(): CarrierName {
    return UPS;
  }

  public hasFakeDelivery(): boolean {
    return true;
  }
}
