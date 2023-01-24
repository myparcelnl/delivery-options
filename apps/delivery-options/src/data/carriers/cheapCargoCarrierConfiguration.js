import { AbstractCarrierConfiguration } from '../../data/carriers/abstractCarrierConfiguration';

export class CheapCargoCarrierConfiguration extends AbstractCarrierConfiguration {
  getCountriesForDelivery() {
    return [];
  }

  getCountriesForPickup() {
    return [];
  }
}
