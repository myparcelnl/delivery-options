import {type InputDeliveryOptionsConfiguration, useApiExceptions} from '@myparcel-dev/do-shared';
import {useAddressStore, useConfigStore} from '../stores';
import {useLanguage} from '../composables';
import {validateConfiguration} from './validateConfiguration';
import {mapDeprecatedUpsCarrierConfig} from './mapDeprecatedUpsCarrierConfig';

export const setConfiguration = (config: InputDeliveryOptionsConfiguration): void => {
  const configStore = useConfigStore();
  const addressStore = useAddressStore();
  const language = useLanguage();
  const {clear} = useApiExceptions();

  const mappedConfig = mapDeprecatedUpsCarrierConfig(config);
  const validated = validateConfiguration(mappedConfig);

  clear();

  if (validated.config) {
    configStore.update(validated.config);
  }

  addressStore.update(validated.address);

  if (validated.strings) {
    language.setStrings(validated.strings);
  }

  window.MyParcelConfig = validated;
};
