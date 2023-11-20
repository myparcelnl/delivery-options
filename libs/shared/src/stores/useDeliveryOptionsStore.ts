import {defineStore} from 'pinia';
import {type DeliveryOptionsConfiguration, type DeliveryOptionsOutput} from '@myparcel-do/shared';

export const useDeliveryOptionsStore = defineStore('deliveryOptions', {
  state: () => ({
    configuration: window.MyParcelConfig ?? {},
    output: {} as DeliveryOptionsOutput,
  }),

  actions: {
    updateConfiguration(configuration: DeliveryOptionsConfiguration): void {
      this.configuration = configuration;

      window.MyParcelConfig = this.configuration;
    },
  },
});
