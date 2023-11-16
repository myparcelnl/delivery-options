import {expect, it, test} from 'vitest';
import {
  CONFIG,
  defaultAddress,
  defaultConfiguration,
  formConfigPickup,
  KEY_ADDRESS,
  KEY_CONFIG,
} from '@myparcel-do/shared';
import {CarrierName, PlatformName} from '@myparcel/constants';
import {mockConfigBus} from './mockConfigBus';

let configBus = mockConfigBus(DEFAULT_PLATFORM);

const settingCases = [
  [CONFIG.ALLOW_DELIVERY_OPTIONS, [CarrierName.PostNl, CarrierName.Dpd, CarrierName.Bpost]],
  [CONFIG.ALLOW_EVENING_DELIVERY, [CarrierName.PostNl]],
  [CONFIG.ALLOW_MORNING_DELIVERY, [CarrierName.PostNl]],
  [CONFIG.ALLOW_ONLY_RECIPIENT, [CarrierName.PostNl]],
  [CONFIG.ALLOW_PICKUP_LOCATIONS, [CarrierName.PostNl, CarrierName.Dpd, CarrierName.Bpost]],
  [CONFIG.ALLOW_SIGNATURE, [CarrierName.PostNl, CarrierName.Dpd]],
];

'configBus', () => {
  it('is a renderless Vue instance', () => {
    expect(configBus._isVue).toBe(true);
    expect(configBus.render).toBeFalsy();
  });

  it.each(settingCases)('sets the correct default value for %p for each carrier', ([setting, carriers]) => {
    [CarrierName.PostNl, CarrierName.Dpd, CarrierName.Bpost].forEach((carrier) => {
      expect(Boolean(configBus.get(setting, null, carrier))).toBe(carriers.includes(carrier));
    });
  });

  it('prioritizes settings correctly', () => {
    configBus = mockConfigBus({
      [KEY_CONFIG]: {
        [CONFIG.PLATFORM]: PlatformName.SendMyParcel,
        [CONFIG.ALLOW_PICKUP_LOCATIONS]: true,
        [CONFIG.CARRIER_SETTINGS]: {
          [CarrierName.Dpd]: {
            [CONFIG.ALLOW_PICKUP_LOCATIONS]: false,
          },
          [CarrierName.Bpost]: {
            [CONFIG.ALLOW_PICKUP_LOCATIONS]: true,
          },
        },
      },
    });

    configBus.$data.currentCarrier = CarrierName.Dpd;
    expect(configBus.get(CONFIG.ALLOW_PICKUP_LOCATIONS)).toBe(false);

    configBus.$data.currentCarrier = CarrierName.Bpost;
    expect(configBus.get(CONFIG.ALLOW_PICKUP_LOCATIONS)).toBe(true);

    configBus = mockConfigBus({
      [KEY_CONFIG]: {
        [CONFIG.PLATFORM]: PlatformName.SendMyParcel,
        [CONFIG.ALLOW_DELIVERY_OPTIONS]: false,
        [CONFIG.CARRIER_SETTINGS]: {
          [CarrierName.Dpd]: {
            [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
          },
          [CarrierName.Bpost]: {
            [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
            [CONFIG.ALLOW_SIGNATURE]: true,
          },
        },
      },
    });

    configBus.$data.currentCarrier = CarrierName.Dpd;
    expect(configBus.isEnabled(CONFIG.ALLOW_SIGNATURE)).toBe(false);
    expect(configBus.isEnabledInAnyCarrier(CONFIG.ALLOW_SIGNATURE)).toBe(true);

    configBus.$data.currentCarrier = CarrierName.Bpost;
    expect(configBus.get(CONFIG.ALLOW_SIGNATURE)).toBe(true);

    configBus = mockConfigBus(DEFAULT_PLATFORM);

    configBus.$data.currentCarrier = CarrierName.Dpd;
    expect(configBus.get(CONFIG.ALLOW_SIGNATURE)).toBe(
      defaultConfiguration(DEFAULT_PLATFORM).config[CONFIG.ALLOW_SIGNATURE],
    );

    configBus.$data.currentCarrier = CarrierName.Bpost;
    expect(configBus.get(CONFIG.PRICE_ONLY_RECIPIENT)).toBe(
      defaultConfiguration(DEFAULT_PLATFORM).config[CONFIG.PRICE_ONLY_RECIPIENT],
    );
  });

  test('getSettingsByCarrier', () => {
    configBus = mockConfigBus({
      [KEY_CONFIG]: {
        [CONFIG.CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
            [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
          },
        },
      },
    });

    expect(configBus.getSettingsByCarrier(CarrierName.PostNl)).toEqual({
      [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
      // Disabled by ConfigurationMerger.
      [CONFIG.ALLOW_SAME_DAY_DELIVERY]: false,
      [CONFIG.ALLOW_SATURDAY_DELIVERY]: false,
    });

    expect(configBus.getSettingsByCarrier(CarrierName.DhlForYou)).toEqual(null);
  });

  test('isEnabledInAnyCarrier', () => {
    const mockData = {
      [KEY_CONFIG]: {
        [CONFIG.PLATFORM]: PlatformName.MyParcel,
        [CONFIG.CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
            [CONFIG.ALLOW_PICKUP_LOCATIONS]: true,
          },
        },
      },
    };

    configBus = mockConfigBus(mockData);
    expect(configBus.isEnabledInAnyCarrier(formConfigPickup)).toEqual(true);

    mockData.config.carrierSettings[CarrierName.PostNl].allowPickupLocations = false;
    configBus = mockConfigBus(mockData);
    expect(configBus.isEnabledInAnyCarrier(formConfigPickup)).toEqual(false);

    mockData.config.platform = PlatformName.SendMyParcel;
    mockData.config.carrierSettings = {
      [CarrierName.Bpost]: {
        [CONFIG.ALLOW_PICKUP_LOCATIONS]: true,
      },
      [CarrierName.Dpd]: {
        [CONFIG.ALLOW_PICKUP_LOCATIONS]: false,
      },
    };
    configBus = mockConfigBus(mockData);
    expect(configBus.isEnabledInAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS)).toEqual(true);
    expect(configBus.isEnabledInAnyCarrier(formConfigPickup)).toEqual(true);

    mockData.config.carrierSettings[CarrierName.Bpost].allowPickupLocations = false;
    mockData.config.carrierSettings[CarrierName.Dpd].allowPickupLocations = false;
    configBus = mockConfigBus(mockData);
    expect(configBus.isEnabledInAnyCarrier(formConfigPickup)).toEqual(false);
  });

  it('supports overriding settings per country', () => {
    const mockData = {
      [KEY_ADDRESS]: defaultAddress[PlatformName.SendMyParcel],
      [KEY_CONFIG]: {
        [CONFIG.PLATFORM]: PlatformName.SendMyParcel,
        [CONFIG.CARRIER_SETTINGS]: {
          [CarrierName.Bpost]: {
            [CONFIG.ALLOW_DELIVERY_OPTIONS]: {
              allow: true,
              items: ['NL', 'BE'],
            },
            [CONFIG.ALLOW_PICKUP_LOCATIONS]: {
              allow: false,
              items: ['BE'],
            },
          },
          [CarrierName.PostNl]: {
            [CONFIG.ALLOW_DELIVERY_OPTIONS]: {
              allow: true,
              items: ['NL'],
            },
            [CONFIG.ALLOW_PICKUP_LOCATIONS]: {
              allow: true,
              items: ['NL'],
            },
          },
          [CarrierName.Dpd]: {
            [CONFIG.ALLOW_DELIVERY_OPTIONS]: {
              allow: false,
              items: ['BE', 'DE'],
            },
            [CONFIG.ALLOW_PICKUP_LOCATIONS]: {
              allow: true,
              items: ['BE', 'DE'],
            },
          },
        },
      },
    };
    configBus = mockConfigBus(mockData);

    configBus.$data.currentCarrier = CarrierName.Dpd;
    expect(configBus.isEnabled(CONFIG.ALLOW_DELIVERY_OPTIONS)).toBe(false);
    expect(configBus.isEnabled(CONFIG.ALLOW_PICKUP_LOCATIONS)).toBe(true);

    configBus.$data.currentCarrier = CarrierName.Bpost;
    expect(configBus.isEnabled(CONFIG.ALLOW_DELIVERY_OPTIONS)).toBe(true);
    expect(configBus.isEnabled(CONFIG.ALLOW_PICKUP_LOCATIONS)).toBe(false);

    configBus.$data.currentCarrier = CarrierName.PostNl;
    expect(configBus.isEnabled(CONFIG.ALLOW_DELIVERY_OPTIONS)).toBe(false);
    expect(configBus.isEnabled(CONFIG.ALLOW_PICKUP_LOCATIONS)).toBe(false);

    configBus.address.cc = 'DE';
    configBus.$data.currentCarrier = CarrierName.Dpd;
    expect(configBus.isEnabled(CONFIG.ALLOW_DELIVERY_OPTIONS)).toBe(false);
    expect(configBus.isEnabled(CONFIG.ALLOW_PICKUP_LOCATIONS)).toBe(true);

    configBus.$data.currentCarrier = CarrierName.Bpost;
    expect(configBus.isEnabled(CONFIG.ALLOW_DELIVERY_OPTIONS)).toBe(false);
    expect(configBus.isEnabled(CONFIG.ALLOW_PICKUP_LOCATIONS)).toBe(true);

    configBus.$data.currentCarrier = CarrierName.PostNl;
    expect(configBus.isEnabled(CONFIG.ALLOW_DELIVERY_OPTIONS)).toBe(false);
    expect(configBus.isEnabled(CONFIG.ALLOW_PICKUP_LOCATIONS)).toBe(false);
  });
});
