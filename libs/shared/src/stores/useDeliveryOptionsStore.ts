import {defineAsyncComponent} from 'vue';
import {defineStore} from 'pinia';
import {type DeliveryOptionsOutput, type InputDeliveryOptionsConfiguration} from '../types';
import {ComponentName} from '../constants';

export const useDeliveryOptionsStore = defineStore('deliveryOptions', {
  state: () => ({
    configuration: window.MyParcelConfig ?? {},
    output: {} as DeliveryOptionsOutput,
  }),

  actions: {
    updateConfiguration(configuration: InputDeliveryOptionsConfiguration): void {
      this.configuration = configuration;

      window.MyParcelConfig = this.configuration;
    },
  },
  getters: {
    resolvedConfiguration(): InputDeliveryOptionsConfiguration {
      return {
        ...this.configuration,

        components: {
          [ComponentName.Checkbox]: defineAsyncComponent(() => import('../components/CheckboxInput.vue')),
          [ComponentName.Select]: defineAsyncComponent(() => import('../components/SelectInput.vue')),
          [ComponentName.Radio]: defineAsyncComponent(() => import('../components/RadioInput.vue')),
          [ComponentName.RadioGroup]: defineAsyncComponent(() => import('../components/RadioGroupInput.vue')),
          [ComponentName.CheckboxGroup]: defineAsyncComponent(() => import('../components/CheckboxGroupInput.vue')),

          ...this.configuration.components,
        },
      };
    },
  },
});
