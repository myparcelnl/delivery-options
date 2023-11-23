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
import {type CarrierName, PlatformName} from '@myparcel/constants';
import {AddressField} from '../../../enums';
import {FEATURES_DELIVERY, FEATURES_PICKUP, FEATURES_SHOW_DELIVERY_DATE} from '../../../data';
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
    return [AddressField.City, AddressField.PostalCode];
  }

  public getFeatures(): PlatformCarrierFeatures {
    return {
      [PlatformName.MyParcel]: [FEATURES_DELIVERY, FEATURES_PICKUP, FEATURES_SHOW_DELIVERY_DATE],
    };
  }

  public getName(): CarrierName {
    return CarrierName.Dhl;
  }
}
