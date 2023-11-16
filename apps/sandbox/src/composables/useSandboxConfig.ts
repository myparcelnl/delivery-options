import {computed} from 'vue';
import {useStorage} from '@vueuse/core';
import {type DeliveryOptionsConfiguration} from '@myparcel-do/shared';

const configStorage = useStorage<string>('settings', null, localStorage);

export const useSandboxConfig = () => {
  return {
    storage: configStorage,

    data: computed(() => JSON.parse(configStorage.value) as DeliveryOptionsConfiguration),
  };
};
