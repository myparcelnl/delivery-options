import {
  CarrierSetting,
  type DeliveryOptionsConfiguration,
  KEY_CARRIER_SETTINGS,
  KEY_CONFIG,
  KEY_ADDRESS,
} from '@myparcel-dev/shared';
import {type RecursivePartial} from '@myparcel-dev/ts-utils';
import {CarrierName} from '@myparcel-dev/constants';
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

  // Do not override existing config with empty carriers if they are not present in the input
  if (!input?.[KEY_CONFIG]?.[KEY_CARRIER_SETTINGS] && validated?.[KEY_CONFIG]?.[KEY_CARRIER_SETTINGS]) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete validated[KEY_CONFIG][KEY_CARRIER_SETTINGS];
  }

  configStore.update(validated?.[KEY_CONFIG] ?? {}, false);
  addressStore.update(validated?.[KEY_ADDRESS] ?? {});

  return resolvedInput ?? {};
};
