import {defineAsyncComponent} from 'vue';
import {defineStore} from 'pinia';
import {type InputDeliveryOptionsConfiguration, type InternalOutput} from '../types';
import {ComponentName} from '../enums';

export enum DeliveryOptionsStoreAction {
  UpdateConfiguration = 'updateConfiguration',
  UpdateOutput = 'updateOutput',
}

export const useDeliveryOptionsStore = defineStore('deliveryOptions', {
  state: () => ({
    configuration: window.MyParcelConfig ?? {},
    internalOutput: {} as InternalOutput,
  }),

  actions: {
    [DeliveryOptionsStoreAction.UpdateConfiguration](configuration: InputDeliveryOptionsConfiguration): void {
      this.configuration = configuration;

      window.MyParcelConfig = this.configuration;
    },

    [DeliveryOptionsStoreAction.UpdateOutput](output: InternalOutput): void {
      this.internalOutput = output;
    },
  },

  getters: {
    resolvedConfiguration(): InputDeliveryOptionsConfiguration {
      return {
        ...this.configuration,

        components: {
          [ComponentName.Checkbox]: defineAsyncComponent(() => import('../components/CheckboxInput.vue')),
          [ComponentName.Select]: defineAsyncComponent(() => import('../components/SelectInputOrSingle.vue')),
          [ComponentName.Radio]: defineAsyncComponent(() => import('../components/RadioInput.vue')),
          [ComponentName.RadioGroup]: defineAsyncComponent(() => import('../components/RadioGroupInput.vue')),
          [ComponentName.CheckboxGroup]: defineAsyncComponent(() => import('../components/CheckboxGroupInput.vue')),

          ...this.configuration.components,
        },
      };
    },
  },
});
