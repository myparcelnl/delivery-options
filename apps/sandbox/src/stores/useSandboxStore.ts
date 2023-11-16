import {defineStore} from 'pinia';
import {useLocalStorage} from '@vueuse/core';
import {type DeliveryOptionsConfiguration} from '@myparcel-do/shared';

export const useSandboxStore = defineStore('sandbox', {
  state: () => ({
    configuration: useLocalStorage<DeliveryOptionsConfiguration>('configuration', {} as DeliveryOptionsConfiguration),
    perCarrier: useLocalStorage('carrierToggle', []),
  }),
});
