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
import { DHL } from '../keys/carrierKeys';
import { MYPARCEL } from '@/data/keys/platformKeys';

export class DhlCarrierConfiguration extends AbstractCarrierConfiguration {
  getName() {
    return DHL;
  }

  getCountriesForDelivery() {
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

  getCountriesForPickup() {
    return [
      AUSTRIA,
      BELGIUM,
      GERMANY,
      DENMARK,
      FINLAND,
      FRANCE,
      UNITED_KINGDOM,
      PORTUGAL,
    ];
  }

  getFeatures() {
    return {
      [MYPARCEL]: [
        FEATURES.FEATURES_DELIVERY,
        FEATURES.FEATURES_PICKUP,
        FEATURES.FEATURES_SHOW_DELIVERY_DATE,
      ],
    };
  }
}
