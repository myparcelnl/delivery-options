import {ref, toRaw} from 'vue';
import {construct, get as objGet} from 'radash';
import {defineStore} from 'pinia';
import {useLocalStorage} from '@vueuse/core';
import {
  CARRIER_SETTINGS,
  type CarrierSettingsObject,
  type DeliveryOptionsAddress,
  type DeliveryOptionsConfig,
  type DeliveryOptionsStrings,
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

const sandboxCarrierSettings = useLocalStorage<CarrierSettingsObject>(
  'carrierSettings',
  getDefaultSandboxCarrierSettings,
);

const sandboxConfig = useLocalStorage<DeliveryOptionsConfig>('config', getDefaultSandboxConfig);
const sandboxAddress = useLocalStorage<DeliveryOptionsAddress>('address', getDefaultSandboxAddress);
const sandboxStrings = useLocalStorage<DeliveryOptionsStrings>('strings', {});

export const useSandboxStore = defineStore('sandbox', {
  state: () => {
    const initialPlatform = objGet(sandboxConfig.value, `${KEY_CONFIG}.${PLATFORM}`, PlatformName.MyParcel);

    return {
      platform: ref<SupportedPlatformName>(initialPlatform ?? PlatformName.MyParcel),
      carrierToggle: useLocalStorage<string[]>('carrierToggle', []),
      address: sandboxAddress,
      strings: sandboxStrings,
      carrierSettings: sandboxCarrierSettings,
      config: sandboxConfig,
    };
  },

  actions: {
    updateConfiguration(configuration: Record<string, unknown>): void {
      const {address, config, strings} = construct(configuration) as InputDeliveryOptionsConfiguration;
      const {carrierSettings, ...restConfig} = config;

      this.address = address;
      this.config = restConfig;
      this.strings = strings ?? {};
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
        [KEY_ADDRESS]: toRaw(this.address),
        [KEY_STRINGS]: strings.value,
      });
    },
  },
});
