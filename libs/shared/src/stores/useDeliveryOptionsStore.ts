import {defineAsyncComponent} from 'vue';
import {defineStore} from 'pinia';
import {type InputDeliveryOptionsConfiguration, type InternalOutput} from '../types';
import {ComponentName} from '../enums';

export const useDeliveryOptionsStore = defineStore('deliveryOptions', {
  state: () => ({
    configuration: window.MyParcelConfig ?? {},
    internalOutput: {} as InternalOutput,
  }),

  actions: {
    updateConfiguration(configuration: InputDeliveryOptionsConfiguration): void {
      this.configuration = configuration;

      window.MyParcelConfig = this.configuration;
    },

    updateOutput(output: InternalOutput): void {
      this.internalOutput = output;
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
