import {toRaw} from 'vue';
import {construct} from 'radash';
import {defineStore} from 'pinia';
import {type RemovableRef, useLocalStorage} from '@vueuse/core';
import {
  type CarrierSettingsObject,
  CarrierSetting,
  ConfigSetting,
  type DeliveryOptionsAddress,
  type InputCarrierSettingsObject,
  type InputDeliveryOptionsConfig,
  type InputDeliveryOptionsConfiguration,
  KEY_ADDRESS,
  KEY_CARRIER_SETTINGS,
  KEY_CONFIG,
  KEY_STRINGS,
} from '@myparcel-dev/do-shared';
import {getDefaultSandboxAddress, getDefaultSandboxCarrierSettings, getDefaultSandboxConfig} from '../config';
import {useLanguage} from '../composables';

type ConfigWithoutCarrierSettings = Omit<InputDeliveryOptionsConfig, 'carrierSettings'>;

export const useSandboxStore = defineStore('sandbox', {
  state: (): {
    address: RemovableRef<DeliveryOptionsAddress>;
    carrierSettings: InputCarrierSettingsObject;
    config: RemovableRef<ConfigWithoutCarrierSettings>;
  } => {
    const carrierSettings = useLocalStorage<CarrierSettingsObject>(
      KEY_CARRIER_SETTINGS,
      getDefaultSandboxCarrierSettings,
    );
    const config = useLocalStorage<ConfigWithoutCarrierSettings>(KEY_CONFIG, getDefaultSandboxConfig);
    const address = useLocalStorage<DeliveryOptionsAddress>(KEY_ADDRESS, getDefaultSandboxAddress);

    return {
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
      this.carrierSettings = carrierSettings ?? {};
    },
  },

  getters: {
    resolvedConfiguration(): InputDeliveryOptionsConfiguration {
      const {language, strings} = useLanguage();
      const cleanedCarrierSettings = Object.fromEntries(
        Object.entries(this.carrierSettings).map(([identifier, settings]) => {
          if (!settings) {
            return [identifier, settings];
          }

          const {
            [CarrierSetting.DeliveryDaysWindow]: deliveryDaysWindow,
            ...rest
          } = settings as Record<string, unknown>;

          void deliveryDaysWindow;

          return [identifier, rest];
        }),
      ) as InputCarrierSettingsObject;

      return toRaw({
        [KEY_CONFIG]: {
          ...this.config,
          [KEY_CARRIER_SETTINGS]: cleanedCarrierSettings,
          [ConfigSetting.Locale]: language.value.code,
        } satisfies InputDeliveryOptionsConfig,
        [KEY_ADDRESS]: this.address,
        [KEY_STRINGS]: strings.value,
      });
    },
  },
});
