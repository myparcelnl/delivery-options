import {type RecursivePartial} from '@myparcel-dev/ts-utils';
import {
  CarrierSetting,
  ConfigSetting,
  type DeliveryOptionsConfig,
  type DeliveryOptionsConfiguration,
  KEY_CARRIER_SETTINGS,
  KEY_CONFIG,
  KEY_ADDRESS,
} from '@myparcel-dev/do-shared';
import {CarrierName} from '@myparcel-dev/constants';
import {useAddressStore, useConfigStore} from '../../stores';
import {validateConfiguration} from '../../config';
import {getMockDeliveryOptionsConfiguration} from './getMockDeliveryOptionsConfiguration';

// Tests don't supply a real proxyCapabilities URL, but the production guard in
// useReactiveCapabilitiesRequest skips the fetch when the URL is empty. The
// vitest global.fetch stub ignores the URL value, so any truthy placeholder is
// enough to make the capabilities pipeline run during tests.
const TEST_PROXY_CAPABILITIES_URL = 'https://example.test/proxyCapabilities';

export const mockDeliveryOptionsConfig = <I extends RecursivePartial<DeliveryOptionsConfiguration>>(input?: I): I => {
  const resolvedInput =
    input ??
    getMockDeliveryOptionsConfiguration({
      [KEY_CONFIG]: {
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
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

  const configUpdate: DeliveryOptionsConfig = {...(validated?.[KEY_CONFIG] ?? {})};
  if (!configUpdate[ConfigSetting.ProxyCapabilities]) {
    configUpdate[ConfigSetting.ProxyCapabilities] = TEST_PROXY_CAPABILITIES_URL;
  }

  configStore.update(configUpdate, false);
  addressStore.update(validated?.[KEY_ADDRESS] ?? {});

  return resolvedInput ?? {};
};
