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
import {type CarrierName} from '@myparcel/constants';
import {ADDRESS_CITY, ADDRESS_POSTAL_CODE, ADDRESS_STREET, DPD, MYPARCEL, SENDMYPARCEL} from '../keys';
import {
  FEATURES_CUTOFF_TIME,
  FEATURES_DELIVERY,
  FEATURES_DROP_OFF_DAYS,
  FEATURES_DROP_OFF_DELAY,
  FEATURES_PICKUP,
} from '../carrierFeatures';
import {type AddressField} from '../../../types';
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
    return [ADDRESS_POSTAL_CODE, ADDRESS_STREET, ADDRESS_CITY];
  }

  public getFeatures(): PlatformCarrierFeatures {
    return {
      [MYPARCEL]: [
        FEATURES_DELIVERY,
        FEATURES_PICKUP,
        FEATURES_DROP_OFF_DAYS,
        FEATURES_DROP_OFF_DELAY,
        FEATURES_CUTOFF_TIME,
      ],
      [SENDMYPARCEL]: [
        FEATURES_DELIVERY,
        FEATURES_PICKUP,
        FEATURES_DROP_OFF_DAYS,
        FEATURES_DROP_OFF_DELAY,
        FEATURES_CUTOFF_TIME,
      ],
    };
  }

  public getName(): CarrierName {
    return DPD;
  }
}
