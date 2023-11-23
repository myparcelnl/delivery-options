import {type InputDeliveryOptionsConfiguration, useDeliveryOptionsStore} from '@myparcel-do/shared';
import {type RecursivePartial} from '@myparcel/ts-utils';
import {getMockDeliveryOptionsConfig} from './getMockDeliveryOptionsConfig';

export const mockDeliveryOptionsConfig = (
  config: RecursivePartial<InputDeliveryOptionsConfiguration> = {},
): InputDeliveryOptionsConfiguration => {
  const store = useDeliveryOptionsStore();

  const mergedConfig = getMockDeliveryOptionsConfig(config);

  store.updateConfiguration(mergedConfig);

  return mergedConfig;
};
