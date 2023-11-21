import {defineStore} from 'pinia';
import {type DeliveryOptionsOutput, type InputDeliveryOptionsConfiguration} from '@myparcel-do/shared';

export const useDeliveryOptionsStore = defineStore('deliveryOptions', {
  state: () => ({
    configuration: (window.MyParcelConfig ?? {}) as InputDeliveryOptionsConfiguration,
    output: {} as DeliveryOptionsOutput,
  }),

  actions: {
    updateConfiguration(configuration: InputDeliveryOptionsConfiguration): void {
      this.configuration = configuration;

      window.MyParcelConfig = this.configuration;
    },
  },
});
