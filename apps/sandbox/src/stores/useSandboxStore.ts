import {ref, toRaw} from 'vue';
import {construct} from 'radash';
import {defineStore} from 'pinia';
import {useLocalStorage} from '@vueuse/core';
import {
  CARRIER_SETTINGS,
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

const sandboxCarrierSettings = useLocalStorage<Record<string, unknown>>(
  'carrierSettings',
  getDefaultSandboxCarrierSettings,
);
const sandboxConfig = useLocalStorage<Record<string, unknown>>('config', getDefaultSandboxConfig);
const sandboxAddress = useLocalStorage<DeliveryOptionsAddress>('address', getDefaultSandboxAddress);

export const useSandboxStore = defineStore('sandbox', {
  state: () => {
    const initialPlatform = sandboxConfig.value?.[`${KEY_CONFIG}.${PLATFORM}`] as SupportedPlatformName | undefined;

    return {
      platform: ref<SupportedPlatformName>(initialPlatform ?? PlatformName.MyParcel),
      carrierToggle: useLocalStorage<string[]>('carrierToggle', []),
      address: sandboxAddress,
      carrierSettings: sandboxCarrierSettings,
      config: sandboxConfig,
    };
  },

  actions: {
    updateConfiguration(configuration: Record<string, unknown>): void {
      const {address, config} = construct(configuration) as InputDeliveryOptionsConfiguration;
      const {carrierSettings, ...restConfig} = config;

      this.address = address;
      this.config = restConfig;
      this.carrierSettings = carrierSettings!;
      this.platform = restConfig.platform!;
    },
  },

  getters: {
    resolvedConfiguration(): InputDeliveryOptionsConfiguration {
      const {language, strings} = useLanguage();

      console.log({strings});

      const resolved = toRaw({
        [KEY_CONFIG]: {
          ...this.config,
          [CARRIER_SETTINGS]: construct(this.carrierSettings),
          [LOCALE]: language.value.code,
          [PLATFORM]: this.platform,
        } satisfies DeliveryOptionsConfig,
        [KEY_ADDRESS]: toRaw(this.address),
        [KEY_STRINGS]: strings,
      });

      return resolved as InputDeliveryOptionsConfiguration;
    },
  },
});
