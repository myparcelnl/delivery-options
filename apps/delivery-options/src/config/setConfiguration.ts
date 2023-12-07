import {type InputDeliveryOptionsConfiguration} from '@myparcel-do/shared';
import {useAddressStore, useConfigStore} from '../stores';
import {useLanguage} from '../composables';
import {validateConfig} from './validateConfig';

export const setConfiguration = (config: InputDeliveryOptionsConfiguration): void => {
  const configStore = useConfigStore();
  const addressStore = useAddressStore();
  const language = useLanguage();

  const validated = validateConfig(config);

  configStore.$patch(validated.config);
  addressStore.$patch(validated.address);

  language.setStrings(validated.strings);
};
