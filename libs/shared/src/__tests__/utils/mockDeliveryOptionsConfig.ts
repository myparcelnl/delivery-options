import {type RecursivePartial} from '@myparcel/ts-utils';
import {type InputDeliveryOptionsConfiguration} from '../../types';
import {useDeliveryOptionsStore} from '../../stores';
import {getMockDeliveryOptionsConfig} from './getMockDeliveryOptionsConfig';

export const mockDeliveryOptionsConfig = (
  config: RecursivePartial<InputDeliveryOptionsConfiguration> = {},
): InputDeliveryOptionsConfiguration => {
  const store = useDeliveryOptionsStore();

  const mergedConfig = getMockDeliveryOptionsConfig(config);

  store.updateConfiguration(mergedConfig);

  return mergedConfig;
};
