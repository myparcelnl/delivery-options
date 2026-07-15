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
import {getProxyCapabilitiesUrl} from '../constants';
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

    syncCarriersFromCapabilities(carrierNames: string[]): void {
      const sandboxDefaults = getDefaultSandboxCarrierSettings();
      const fallbackSettings = sandboxDefaults[Object.keys(sandboxDefaults)[0] as keyof CarrierSettingsObject];

      this.carrierSettings = Object.fromEntries(
        carrierNames.map((name) => [
          name,
          (this.carrierSettings as Record<string, unknown>)[name] ??
            (sandboxDefaults as Record<string, unknown>)[name] ??
            fallbackSettings,
        ]),
      ) as CarrierSettingsObject;
    },
  },

  getters: {
    resolvedConfiguration(): InputDeliveryOptionsConfiguration {
      const {language, strings} = useLanguage();

      // Keep a per-carrier deliveryDaysWindow only when it is an actual number (0 included).
      // An empty field (undefined or the "" a cleared number input emits) is omitted so the
      // carrier inherits the global window - keeping the UI and the passed config consistent.
      const cleanedCarrierSettings = Object.fromEntries(
        Object.entries(this.carrierSettings).map(([identifier, settings]) => {
          if (!settings) {
            return [identifier, settings];
          }

          const {[CarrierSetting.DeliveryDaysWindow]: deliveryDaysWindow, ...rest} = settings as Record<
            string,
            unknown
          >;

          return typeof deliveryDaysWindow === 'number' && Number.isFinite(deliveryDaysWindow)
            ? [identifier, {...rest, [CarrierSetting.DeliveryDaysWindow]: deliveryDaysWindow}]
            : [identifier, rest];
        }),
      ) as InputCarrierSettingsObject;

      return toRaw({
        [KEY_CONFIG]: {
          ...this.config,
          [KEY_CARRIER_SETTINGS]: cleanedCarrierSettings,
          [ConfigSetting.Locale]: language.value.code,
          [ConfigSetting.ProxyCapabilities]: getProxyCapabilitiesUrl(this.config.apiBaseUrl),
        } satisfies InputDeliveryOptionsConfig,
        [KEY_ADDRESS]: this.address,
        [KEY_STRINGS]: strings.value,
      });
    },
  },
});
