import {AbstractCarrierConfiguration} from './abstractCarrierConfiguration';

export class CheapCargoCarrierConfiguration extends AbstractCarrierConfiguration {
  public getCountriesForDelivery(): string[] {
    return [];
  }

  public getCountriesForPickup(): string[] {
    return [];
  }
}
