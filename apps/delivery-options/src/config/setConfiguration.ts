import {type InputDeliveryOptionsConfiguration} from '@myparcel-do/shared';
import {useAddressStore, useConfigStore} from '../stores';
import {useLanguage} from '../composables';
import {validateConfiguration} from './validateConfiguration';

export const setConfiguration = (config: InputDeliveryOptionsConfiguration): void => {
  const configStore = useConfigStore();
  const addressStore = useAddressStore();
  const language = useLanguage();

  const validated = validateConfiguration(config);

  configStore.update(validated.config);
  addressStore.$patch(validated.address);

  language.setStrings(validated.strings);
};
