import {useStorage} from '@vueuse/core';
import {type DeliveryOptionsConfiguration} from '@myparcel-do/shared';

const configStorage = useStorage<string>('settings', null, localStorage);

export const useSandboxConfig = () => {
  return {
    storage: configStorage,
    value: JSON.parse(configStorage.value) as DeliveryOptionsConfiguration,
  };
};
