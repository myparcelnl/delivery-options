import {defineStore} from 'pinia';
import {useLocalStorage} from '@vueuse/core';
import {type InputDeliveryOptionsConfiguration} from '@myparcel-do/shared';
import {getDefaultSandboxConfiguration} from '../config/getDefaultSandboxConfiguration';

export const useSandboxStore = defineStore('sandbox', {
  state: () => {
    return {
      configuration: useLocalStorage<InputDeliveryOptionsConfiguration>(
        'configuration',
        getDefaultSandboxConfiguration,
      ),
      carrierToggle: useLocalStorage<string[]>('carrierToggle', []),
    };
  },

  actions: {
    updateConfiguration(configuration: InputDeliveryOptionsConfiguration): void {
      this.configuration.value = configuration;
    },
  },
});
