import {toRaw} from 'vue';
import {construct, get as objGet} from 'radash';
import {defineStore} from 'pinia';
import {useLocalStorage} from '@vueuse/core';
import {
  type CarrierSettingsObject,
  ConfigSetting,
  type DeliveryOptionsAddress,
  type DeliveryOptionsConfig,
  type InputDeliveryOptionsConfiguration,
  KEY_ADDRESS,
  KEY_CARRIER_SETTINGS,
  KEY_CONFIG,
  KEY_STRINGS,
  type SupportedPlatformName,
} from '@myparcel-do/shared';
import {PlatformName} from '@myparcel/constants';
import {getDefaultSandboxAddress, getDefaultSandboxCarrierSettings, getDefaultSandboxConfig} from '../config';
import {useLanguage} from '../composables';

export const useSandboxStore = defineStore('sandbox', {
  state: (): {
    config: DeliveryOptionsConfig;
    carrierSettings: CarrierSettingsObject;
    address: DeliveryOptionsAddress;
    platform: SupportedPlatformName;
  } => {
    const carrierSettings = useLocalStorage<CarrierSettingsObject>(
      KEY_CARRIER_SETTINGS,
      getDefaultSandboxCarrierSettings,
    );
    const config = useLocalStorage<DeliveryOptionsConfig>(KEY_CONFIG, getDefaultSandboxConfig);
    const address = useLocalStorage<DeliveryOptionsAddress>(KEY_ADDRESS, getDefaultSandboxAddress);

    const initialPlatform = objGet(config.value, `${KEY_CONFIG}.${ConfigSetting.Platform}`, PlatformName.MyParcel);

    return {
      platform: initialPlatform ?? PlatformName.MyParcel,
      carrierToggle: useLocalStorage<string[]>('carrierToggle', []),
      address,
      carrierSettings,
      config,
    };
  },

  actions: {
    updateConfiguration(configuration: Record<string, unknown>): void {
      const {address, config} = construct(configuration) as InputDeliveryOptionsConfiguration;
      const {carrierSettings, ...restConfig} = config ?? {};

      this.address = address;
      this.config = restConfig;
      this.carrierSettings = carrierSettings!;
      this.platform = restConfig.platform!;
    },
  },

  getters: {
    resolvedConfiguration(): Omit<InputDeliveryOptionsConfiguration, 'components'> {
      const {language, strings} = useLanguage();

      return toRaw({
        [KEY_CONFIG]: {
          ...this.config,
          [KEY_CARRIER_SETTINGS]: construct(this.carrierSettings),
          [ConfigSetting.Locale]: language.value.code,
          [ConfigSetting.Platform]: this.platform,
        } satisfies DeliveryOptionsConfig,
        [KEY_ADDRESS]: this.address,
        [KEY_STRINGS]: strings.value,
      });
    },
  },
});
