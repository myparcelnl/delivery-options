import {
  CarrierSetting,
  type DeliveryOptionsConfiguration,
  KEY_CARRIER_SETTINGS,
  KEY_CONFIG,
  KEY_ADDRESS,
} from '@myparcel-do/shared';
import {type RecursivePartial} from '@myparcel/ts-utils';
import {CarrierName} from '@myparcel/constants';
import {useAddressStore, useConfigStore} from '../../stores';
import {validateConfiguration} from '../../config';
import {getMockDeliveryOptionsConfiguration} from './getMockDeliveryOptionsConfiguration';

export const mockDeliveryOptionsConfig = <I extends RecursivePartial<DeliveryOptionsConfiguration>>(input?: I): I => {
  const resolvedInput =
    input ??
    getMockDeliveryOptionsConfiguration({
      [KEY_CONFIG]: {
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
            [CarrierSetting.AllowDeliveryOptions]: true,
            [CarrierSetting.AllowStandardDelivery]: true,
          },
        },
      },
    });

  const configStore = useConfigStore();
  const addressStore = useAddressStore();

  const validated = validateConfiguration(resolvedInput as DeliveryOptionsConfiguration);

  configStore.update(validated?.[KEY_CONFIG] ?? {});
  addressStore.update(validated?.[KEY_ADDRESS] ?? {});

  return resolvedInput ?? {};
};
