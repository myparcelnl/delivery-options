import {
  AUSTRIA,
  BELGIUM,
  BULGARIA,
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
  LIECHTENSTEIN,
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
import {
  FEATURES_CUTOFF_TIME,
  FEATURES_DELIVERY,
  FEATURES_DROP_OFF_DAYS,
  FEATURES_DROP_OFF_DELAY,
  FEATURES_PICKUP,
} from '../../../data/carrierFeatures';
import {AddressField} from '../../../constants';
import {AbstractCarrierConfiguration, type PlatformCarrierFeatures} from './abstractCarrierConfiguration';

export class DpdCarrierConfiguration extends AbstractCarrierConfiguration {
  public getCountriesForDelivery(): string[] {
    return [
      AUSTRIA,
      BELGIUM,
      BULGARIA,
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
      LIECHTENSTEIN,
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
    ];
  }

  public getCountriesForPickup(): string[] {
    return [
      AUSTRIA,
      BELGIUM,
      CZECH_REPUBLIC,
      DENMARK,
      ESTONIA,
      FINLAND,
      FRANCE,
      GERMANY,
      HUNGARY,
      LATVIA,
      LITHUANIA,
      LUXEMBOURG,
      NETHERLANDS,
      POLAND,
      PORTUGAL,
      SLOVAKIA,
      SLOVENIA,
      SPAIN,
      UNITED_KINGDOM,
    ];
  }

  public getDefaultRequestParameters(): AddressField[] {
    return [AddressField.PostalCode, AddressField.Street, AddressField.City];
  }

  public getFeatures(): PlatformCarrierFeatures {
    return {
      [PlatformName.MyParcel]: [
        FEATURES_DELIVERY,
        FEATURES_PICKUP,
        FEATURES_DROP_OFF_DAYS,
        FEATURES_DROP_OFF_DELAY,
        FEATURES_CUTOFF_TIME,
      ],
      [PlatformName.SendMyParcel]: [
        FEATURES_DELIVERY,
        FEATURES_PICKUP,
        FEATURES_DROP_OFF_DAYS,
        FEATURES_DROP_OFF_DELAY,
        FEATURES_CUTOFF_TIME,
      ],
    };
  }

  public getName(): CarrierName {
    return CarrierName.Dpd;
  }
}
