import {type InputDeliveryOptionsConfiguration, validateDeliveryOptionsConfig} from '@myparcel-do/shared';
import {useAddressStore, useConfigStore} from '../stores';

export const setConfiguration = (config: InputDeliveryOptionsConfiguration): void => {
  const configStore = useConfigStore();
  const addressStore = useAddressStore();

  const validated = validateDeliveryOptionsConfig(config);

  configStore.$patch(validated.config);
  addressStore.$patch(validated.address);
};
