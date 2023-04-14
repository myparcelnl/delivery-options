import * as FEATURES from '@/data/carrierFeatures';
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
} from '@myparcel/js-sdk/dist/constant/countries-iso2';
import { AbstractCarrierConfiguration } from '@/data/carriers/abstractCarrierConfiguration';
import { DHL_EUROPLUS } from '../keys/carrierKeys';
import { MYPARCEL } from '@/data/keys/platformKeys';

export class DhlEuroplusCarrierConfiguration extends AbstractCarrierConfiguration {
  getName() {
    return DHL_EUROPLUS;
  }

  getCountriesForDelivery() {
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

  getCountriesForPickup() {
    return [];
  }

  getFeatures() {
    return {
      [MYPARCEL]: [
        FEATURES.FEATURES_DELIVERY,
      ],
    };
  }
}
