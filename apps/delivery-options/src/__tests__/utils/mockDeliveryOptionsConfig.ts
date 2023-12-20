import {type DeliveryOptionsConfiguration} from '@myparcel-do/shared';
import {type RecursivePartial} from '@myparcel/ts-utils';
import {useAddressStore, useConfigStore} from '../../stores';

export const mockDeliveryOptionsConfig = <I extends RecursivePartial<DeliveryOptionsConfiguration>>(input?: I): I => {
  const config = useConfigStore();
  const address = useAddressStore();

  config.$patch(input.config ?? {});
  address.$patch(input.address ?? {});

  return input ?? {};
};
