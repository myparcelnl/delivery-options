import {toRaw, toValue} from 'vue';
import {construct, get} from 'radash';
import {defineStore} from 'pinia';
import {type RemovableRef, useLocalStorage} from '@vueuse/core';
import {
  type CarrierSettingsObject,
  ConfigSetting,
  DEFAULT_PLATFORM,
  type DeliveryOptionsAddress,
  type InputCarrierSettingsObject,
  type InputDeliveryOptionsConfig,
  type InputDeliveryOptionsConfiguration,
  KEY_ADDRESS,
  KEY_CARRIER_SETTINGS,
  KEY_CONFIG,
  KEY_STRINGS,
  type SupportedPlatformName,
  KEY_PLATFORM_CONFIG,
  type PlatformConfiguration,
  getPlatformConfig,
} from '@myparcel-dev/shared';
import {getDefaultSandboxAddress, getDefaultSandboxCarrierSettings, getDefaultSandboxConfig} from '../config';
import {useLanguage} from '../composables';

type ConfigWithoutCarrierSettings = Omit<InputDeliveryOptionsConfig, 'carrierSettings'>;

export const useSandboxStore = defineStore('sandbox', {
  state: (): {
    address: RemovableRef<DeliveryOptionsAddress>;
    carrierSettings: InputCarrierSettingsObject;
    config: RemovableRef<ConfigWithoutCarrierSettings>;
    platform: SupportedPlatformName;
    platformConfig: RemovableRef<PlatformConfiguration>;
  } => {
    const carrierSettings = useLocalStorage<CarrierSettingsObject>(
      KEY_CARRIER_SETTINGS,
      getDefaultSandboxCarrierSettings,
    );
    const config = useLocalStorage<ConfigWithoutCarrierSettings>(KEY_CONFIG, getDefaultSandboxConfig);
    const address = useLocalStorage<DeliveryOptionsAddress>(KEY_ADDRESS, getDefaultSandboxAddress);
    const platformConfig = useLocalStorage<PlatformConfiguration>(
      KEY_PLATFORM_CONFIG,
      getPlatformConfig(DEFAULT_PLATFORM),
    );

    return {
      address,
      carrierSettings,
      config,
      platform: get(toValue(config), ConfigSetting.Platform, DEFAULT_PLATFORM),
      platformConfig,
    };
  },

  actions: {
    updateConfiguration(configuration: Record<string, unknown>): void {
      const {address, config, platformConfig} = construct(configuration) as InputDeliveryOptionsConfiguration;
      const {carrierSettings, ...restConfig} = config ?? {};

      this.address = address;
      this.config = restConfig;
      this.carrierSettings = carrierSettings ?? {};
      this.platform = restConfig.platform ?? DEFAULT_PLATFORM;
      this.platformConfig = platformConfig ?? {carriers: []};
    },
  },

  getters: {
    resolvedConfiguration(): InputDeliveryOptionsConfiguration {
      const {language, strings} = useLanguage();

      return toRaw({
        [KEY_CONFIG]: {
          ...this.config,
          [KEY_CARRIER_SETTINGS]: this.carrierSettings,
          [ConfigSetting.Locale]: language.value.code,
          [ConfigSetting.Platform]: this.platform,
        } satisfies InputDeliveryOptionsConfig,
        [KEY_ADDRESS]: this.address,
        [KEY_STRINGS]: strings.value,
        [KEY_PLATFORM_CONFIG]: this.platformConfig,
      });
    },
  },
});
