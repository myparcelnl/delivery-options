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
  POLAND,
  PORTUGAL,
  ROMANIA,
  SLOVAKIA,
  SLOVENIA,
  SPAIN,
  SWEDEN,
  UNITED_KINGDOM,
} from '@myparcel/constants/countries';
import {type CarrierName} from '@myparcel/constants';
import {ADDRESS_CITY, ADDRESS_POSTAL_CODE, DHL, MYPARCEL} from '../keys';
import {FEATURES_DELIVERY, FEATURES_PICKUP, FEATURES_SHOW_DELIVERY_DATE} from '../carrierFeatures';
import {type AddressField} from '../../../types';
import {AbstractCarrierConfiguration, type PlatformCarrierFeatures} from './abstractCarrierConfiguration';

export class DhlCarrierConfiguration extends AbstractCarrierConfiguration {
  public getCountriesForDelivery(): string[] {
    return [
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
      POLAND,
      PORTUGAL,
      ROMANIA,
      SLOVAKIA,
      SLOVENIA,
      SPAIN,
      SWEDEN,
    ];
  }

  public getCountriesForPickup(): string[] {
    return [AUSTRIA, BELGIUM, GERMANY, DENMARK, FINLAND, FRANCE, UNITED_KINGDOM, PORTUGAL];
  }

  public getDefaultRequestParameters(): AddressField[] {
    return [ADDRESS_CITY, ADDRESS_POSTAL_CODE];
  }

  public getFeatures(): PlatformCarrierFeatures {
    return {
      [MYPARCEL]: [FEATURES_DELIVERY, FEATURES_PICKUP, FEATURES_SHOW_DELIVERY_DATE],
    };
  }

  public getName(): CarrierName {
    return DHL;
  }
}
