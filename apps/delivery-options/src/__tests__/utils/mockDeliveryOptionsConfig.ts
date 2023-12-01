import {type InputDeliveryOptionsConfiguration} from '@myparcel-do/shared';
import {type RecursivePartial} from '@myparcel/ts-utils';
import {useAddressStore, useConfigStore} from '../../stores';

export const mockDeliveryOptionsConfig = (input: RecursivePartial<InputDeliveryOptionsConfiguration> = {}): void => {
  const config = useConfigStore();
  const address = useAddressStore();

  config.$patch(input.config ?? {});
  address.$patch(input.address ?? {});
};
