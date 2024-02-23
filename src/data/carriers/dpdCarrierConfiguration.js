import * as FEATURES from '@/data/carrierFeatures';
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
} from '@myparcel/js-sdk/dist/constant/countries-iso2';
import { CITY, POSTAL_CODE, STREET } from '../keys/addressKeys';
import { AbstractCarrierConfiguration } from '@/data/carriers/abstractCarrierConfiguration';
import { DPD } from '../keys/carrierKeys';
import { MYPARCEL, SENDMYPARCEL } from '@/data/keys/platformKeys';

export class DpdCarrierConfiguration extends AbstractCarrierConfiguration {
  getName() {
    return DPD;
  }

  getDefaultRequestParameters() {
    return [POSTAL_CODE, STREET, CITY];
  }

  getCountriesForDelivery() {
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

  getCountriesForPickup() {
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

  getFeatures() {
    return {
      [MYPARCEL]: [
        FEATURES.FEATURES_DELIVERY,
        FEATURES.FEATURES_PICKUP,
      ], [SENDMYPARCEL]: [
        FEATURES.FEATURES_DELIVERY,
        FEATURES.FEATURES_PICKUP,
        FEATURES.FEATURES_DROP_OFF_DAYS,
        FEATURES.FEATURES_DROP_OFF_DELAY,
        FEATURES.FEATURES_CUTOFF_TIME,
      ],
    };
  }
}
