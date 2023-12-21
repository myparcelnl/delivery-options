import {
  ALLOW_DELIVERY_OPTIONS,
  CARRIER_SETTINGS,
  type DeliveryOptionsConfiguration,
  KEY_CONFIG,
} from '@myparcel-do/shared';
import {type RecursivePartial} from '@myparcel/ts-utils';
import {CarrierName} from '@myparcel/constants';
import {useAddressStore, useConfigStore} from '../../stores';
import {getMockDeliveryOptionsConfiguration} from './getMockDeliveryOptionsConfiguration';

export const mockDeliveryOptionsConfig = <I extends RecursivePartial<DeliveryOptionsConfiguration>>(input?: I): I => {
  const resolvedInput =
    input ??
    getMockDeliveryOptionsConfiguration({
      [KEY_CONFIG]: {
        [CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
            [ALLOW_DELIVERY_OPTIONS]: true,
          },
        },
      },
    });

  const config = useConfigStore();
  const address = useAddressStore();

  config.$patch(resolvedInput?.config ?? {});
  address.$patch(resolvedInput?.address ?? {});

  return resolvedInput ?? {};
};
