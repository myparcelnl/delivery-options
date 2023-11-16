import {defineStore} from 'pinia';
import {type DeliveryOptionsConfiguration, type DeliveryOptionsOutput} from '@myparcel-do/shared';

export const useDeliveryOptionsStore = defineStore('deliveryOptions', {
  state: () => ({
    configuration: (window.MyParcelConfig ?? {}) as DeliveryOptionsConfiguration,
    output: {} as DeliveryOptionsOutput,
  }),

  actions: {
    updateConfiguration(configuration: DeliveryOptionsConfiguration): void {
      console.log('update config');
      this.configuration = configuration;

      window.MyParcelConfig = this.configuration;
    },
  },
});
