import * as CARRIERS from '@/data/keys/carrierKeys';
import * as CONFIG from '@/data/keys/configKeys';
import { MYPARCEL, SENDMYPARCEL } from '@/data/keys/platformKeys';
import { DEFAULT_PLATFORM } from '@/data/keys/settingsConsts';
import { defaultConfiguration } from '@/config/defaultConfiguration';
import { formConfigPickup } from '@/config/formConfig';
import { mockConfigBus } from './mockConfigBus';

let configBus = mockConfigBus(DEFAULT_PLATFORM);

const settingCases = [
  [CONFIG.ALLOW_DELIVERY_OPTIONS, [CARRIERS.POSTNL, CARRIERS.DPD, CARRIERS.BPOST]],
  [CONFIG.ALLOW_EVENING_DELIVERY, [CARRIERS.POSTNL]],
  [CONFIG.ALLOW_MORNING_DELIVERY, [CARRIERS.POSTNL]],
  [CONFIG.ALLOW_ONLY_RECIPIENT, [CARRIERS.POSTNL]],
  [CONFIG.ALLOW_PICKUP_LOCATIONS, [CARRIERS.POSTNL, CARRIERS.DPD, CARRIERS.BPOST]],
  [CONFIG.ALLOW_SIGNATURE, [CARRIERS.POSTNL, CARRIERS.DPD]],
];

describe('configBus', () => {
  it('is a renderless Vue instance', () => {
    expect(configBus._isVue).toBe(true);
    expect(configBus.render).toBeFalsy();
  });

  it.each(settingCases)('sets the correct default value for %p for each carrier', ([setting, carriers]) => {
    [CARRIERS.POSTNL, CARRIERS.DPD, CARRIERS.BPOST].forEach((carrier) => {
      expect(Boolean(configBus.get(setting, null, carrier))).toBe(carriers.includes(carrier));
    });
  });

  it('prioritizes settings correctly', () => {
    configBus = mockConfigBus({
      config: {
        platform: SENDMYPARCEL,
        [CONFIG.ALLOW_PICKUP_LOCATIONS]: true,
        [CONFIG.CARRIER_SETTINGS]: {
          [CARRIERS.DPD]: {
            [CONFIG.ALLOW_PICKUP_LOCATIONS]: false,
          },
        },
      },
    });

    configBus.$data.currentCarrier = CARRIERS.DPD;
    expect(configBus.get(CONFIG.ALLOW_PICKUP_LOCATIONS)).toBe(false);

    configBus.$data.currentCarrier = CARRIERS.BPOST;
    expect(configBus.get(CONFIG.ALLOW_PICKUP_LOCATIONS)).toBe(true);

    configBus = mockConfigBus({
      config: {
        platform: SENDMYPARCEL,
        [CONFIG.ALLOW_DELIVERY_OPTIONS]: false,
        [CONFIG.CARRIER_SETTINGS]: {
          [CARRIERS.DPD]: {
            [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
          },
        },
      },
    });

    configBus.$data.currentCarrier = CARRIERS.DPD;
    expect(configBus.get(CONFIG.ALLOW_SIGNATURE)).toBe(true);

    configBus.$data.currentCarrier = CARRIERS.BPOST;
    expect(configBus.get(CONFIG.ALLOW_SIGNATURE)).toBe(false);

    configBus = mockConfigBus(DEFAULT_PLATFORM);

    configBus.$data.currentCarrier = CARRIERS.DPD;
    expect(configBus.get(CONFIG.ALLOW_SIGNATURE))
      .toBe(defaultConfiguration(DEFAULT_PLATFORM).config[CONFIG.ALLOW_SIGNATURE]);

    configBus.$data.currentCarrier = CARRIERS.BPOST;
    expect(configBus.get(CONFIG.PRICE_ONLY_RECIPIENT))
      .toBe(defaultConfiguration(DEFAULT_PLATFORM).config[CONFIG.PRICE_ONLY_RECIPIENT]);
  });

  test('getSettingsByCarrier', () => {
    configBus = mockConfigBus();
    const carrier = 'postnl';

    expect(configBus.getSettingsByCarrier(carrier)).toEqual(configBus.config.carrierSettings[carrier]);
  });

  test('isEnabledInAnyCarrier', () => {
    const mockData = {
      config: {
        platform: MYPARCEL,
        carrierSettings: {
          postnl: {
            allowPickupLocations: true,
          },
        },
      },
    };

    configBus = mockConfigBus(mockData);
    expect(configBus.isEnabledInAnyCarrier(formConfigPickup)).toEqual(true);

    mockData.config.carrierSettings.postnl.allowPickupLocations = false;
    configBus = mockConfigBus(mockData);
    expect(configBus.isEnabledInAnyCarrier(formConfigPickup)).toEqual(false);

    mockData.config.platform = CARRIERS.BPOST;
    mockData.config.carrierSettings = {
      bpost: { allowPickupLocations: true },
      dpd: { allowPickupLocations: false },
    };
    configBus = mockConfigBus(mockData);
    expect(configBus.isEnabledInAnyCarrier(formConfigPickup)).toEqual(true);

    mockData.config.carrierSettings.bpost.allowPickupLocations = false;
    mockData.config.carrierSettings.dpd.allowPickupLocations = false;
    configBus = mockConfigBus(mockData);
    expect(configBus.isEnabledInAnyCarrier(formConfigPickup)).toEqual(false);
  });
});
