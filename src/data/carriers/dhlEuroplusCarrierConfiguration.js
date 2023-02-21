import * as FEATURES from '@/data/carrierFeatures';
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
