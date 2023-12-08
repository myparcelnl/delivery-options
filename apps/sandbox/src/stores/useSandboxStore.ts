import {ref, toRaw} from 'vue';
import {construct, get as objGet} from 'radash';
import {defineStore} from 'pinia';
import {useLocalStorage} from '@vueuse/core';
import {
  CARRIER_SETTINGS,
  type CarrierSettingsObject,
  type DeliveryOptionsAddress,
  type DeliveryOptionsConfig,
  type InputDeliveryOptionsConfiguration,
  KEY_ADDRESS,
  KEY_CONFIG,
  KEY_STRINGS,
  LOCALE,
  PLATFORM,
  type SupportedPlatformName,
} from '@myparcel-do/shared';
import {PlatformName} from '@myparcel/constants';
import {getDefaultSandboxAddress, getDefaultSandboxCarrierSettings, getDefaultSandboxConfig} from '../config';
import {useLanguage} from '../composables';

export const useSandboxStore = defineStore('sandbox', {
  state: () => {
    const carrierSettings = useLocalStorage<CarrierSettingsObject>(CARRIER_SETTINGS, getDefaultSandboxCarrierSettings);
    const config = useLocalStorage<DeliveryOptionsConfig>(KEY_CONFIG, getDefaultSandboxConfig);
    const address = useLocalStorage<DeliveryOptionsAddress>(KEY_ADDRESS, getDefaultSandboxAddress);

    const initialPlatform = objGet(config.value, `${KEY_CONFIG}.${PLATFORM}`, PlatformName.MyParcel);

    return {
      platform: ref<SupportedPlatformName>(initialPlatform ?? PlatformName.MyParcel),
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
          [CARRIER_SETTINGS]: construct(this.carrierSettings),
          [LOCALE]: language.value.code,
          [PLATFORM]: this.platform,
        } satisfies DeliveryOptionsConfig,
        [KEY_ADDRESS]: this.address,
        [KEY_STRINGS]: strings.value,
      });
    },
  },
});
