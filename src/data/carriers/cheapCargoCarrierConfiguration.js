import { AbstractCarrierConfiguration } from '@/data/carriers/abstractCarrierConfiguration';

export class CheapCargoCarrierConfiguration extends AbstractCarrierConfiguration {
  getDefaultConfig() {
    return {};
  }

  getFeatures() {
    return [];
  }
}
