import {type InputDeliveryOptionsConfiguration, validateDeliveryOptionsConfig} from '@myparcel-do/shared';
import {useAddressStore, useConfigStore} from '../stores';
import {useLanguage} from '../composables';

export const setConfiguration = (config: InputDeliveryOptionsConfiguration): void => {
  const configStore = useConfigStore();
  const addressStore = useAddressStore();
  const language = useLanguage();

  const validated = validateDeliveryOptionsConfig(config);
  configStore.$patch(validated.config);

  addressStore.$patch(validated.address);

  language.setStrings(validated.strings);
};
