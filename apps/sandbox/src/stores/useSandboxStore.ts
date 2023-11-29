import {defineStore} from 'pinia';
import {useLocalStorage} from '@vueuse/core';
import {getDefaultSandboxConfiguration} from '../config/getDefaultSandboxConfiguration';

export const useSandboxStore = defineStore('sandbox', {
  state: () => {
    return {
      configuration: useLocalStorage<Record<string, unknown>>('configuration', getDefaultSandboxConfiguration),
      carrierToggle: useLocalStorage<string[]>('carrierToggle', []),
    };
  },

  actions: {
    updateConfiguration(configuration: Record<string, unknown>): void {
      this.configuration = configuration;
    },
  },
});
