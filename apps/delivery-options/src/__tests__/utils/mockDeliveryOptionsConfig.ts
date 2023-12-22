import {CarrierSetting, type DeliveryOptionsConfiguration, KEY_CARRIER_SETTINGS, KEY_CONFIG} from '@myparcel-do/shared';
import {type RecursivePartial} from '@myparcel/ts-utils';
import {CarrierName} from '@myparcel/constants';
import {useAddressStore, useConfigStore} from '../../stores';
import {getMockDeliveryOptionsConfiguration} from './getMockDeliveryOptionsConfiguration';

export const mockDeliveryOptionsConfig = <I extends RecursivePartial<DeliveryOptionsConfiguration>>(input?: I): I => {
  const resolvedInput =
    input ??
    getMockDeliveryOptionsConfiguration({
      [KEY_CONFIG]: {
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
            [CarrierSetting.AllowDeliveryOptions]: true,
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
