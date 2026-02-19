import {beforeEach, describe, expect, it, vi} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {ref} from 'vue';
import {
  CarrierSetting,
  KEY_ADDRESS,
  KEY_CARRIER_SETTINGS,
  KEY_CONFIG,
  KEY_STRINGS,
} from '@myparcel-dev/do-shared';
import {useSandboxStore} from './useSandboxStore';

vi.mock('@vueuse/core', () => {
  return {
    useLocalStorage: <T>(_: string, defaultValue: T | (() => T)) => {
      const resolved = typeof defaultValue === 'function' ? (defaultValue as () => T)() : defaultValue;
      return ref(resolved);
    },
  };
});

vi.mock('../composables', () => {
  return {
    useLanguage: () => ({
      language: ref({code: 'en'}),
      strings: ref({}),
    }),
  };
});

describe('useSandboxStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('strips per-carrier deliveryDaysWindow in resolvedConfiguration', () => {
    const store = useSandboxStore();

    store.config = {[CarrierSetting.DeliveryDaysWindow]: 3};
    store.carrierSettings = {
      postnl: {
        [CarrierSetting.DeliveryDaysWindow]: 0,
        [CarrierSetting.AllowDeliveryOptions]: true,
      },
    };

    const resolved = store.resolvedConfiguration;
    const resolvedConfig = resolved[KEY_CONFIG];
    const resolvedCarrierSettings = resolvedConfig[KEY_CARRIER_SETTINGS] as Record<string, Record<string, unknown>>;

    expect(resolvedConfig[CarrierSetting.DeliveryDaysWindow]).toBe(3);
    expect(resolvedCarrierSettings.postnl[CarrierSetting.DeliveryDaysWindow]).toBeUndefined();
    expect(resolvedCarrierSettings.postnl[CarrierSetting.AllowDeliveryOptions]).toBe(true);
  });

  it('updates state from updateConfiguration input', () => {
    const store = useSandboxStore();
    const configuration = {
      [KEY_CONFIG]: {
        [KEY_CARRIER_SETTINGS]: {
          postnl: {
            [CarrierSetting.AllowDeliveryOptions]: true,
          },
        },
      },
      [KEY_ADDRESS]: {
        cc: 'NL',
        city: 'Hoofddorp',
        postalCode: '2132 JE',
        street: 'Antareslaan 31',
      },
      [KEY_STRINGS]: {foo: 'bar'},
    };

    store.updateConfiguration(configuration);

    expect(store.carrierSettings).toEqual({
      postnl: {
        [CarrierSetting.AllowDeliveryOptions]: true,
      },
    });
    expect(store.address).toEqual(configuration[KEY_ADDRESS]);
  });
});
