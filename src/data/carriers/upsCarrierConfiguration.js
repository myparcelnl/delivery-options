import * as FEATURES from '@/data/carrierFeatures';
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
  NETHERLANDS,
  POLAND,
  PORTUGAL,
  ROMANIA,
  SLOVAKIA,
  SLOVENIA,
  SPAIN,
} from '@myparcel/js-sdk/dist/constant/countries-iso2';
import { CITY, POSTAL_CODE, STREET } from '../keys/addressKeys';
import { AbstractCarrierConfiguration } from '@/data/carriers/abstractCarrierConfiguration';
import { MYPARCEL } from '@/data/keys/platformKeys';
import { UPS } from '../keys/carrierKeys';

export class UpsCarrierConfiguration extends AbstractCarrierConfiguration {
  getName() {
    return UPS;
  }

  getDefaultRequestParameters() {
    return [POSTAL_CODE, STREET, CITY];
  }

  getCountriesForDelivery() {
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

  hasFakeDelivery() {
    return true;
  }

  getCountriesBlacklist() {
    return [NETHERLANDS];
  }

  getCountriesForPickup() {
    return [
      GERMANY,
    ];
  }

  getFeatures() {
    return {
      [MYPARCEL]: [
        FEATURES.FEATURES_DELIVERY,
      ],
    };
  }
}
