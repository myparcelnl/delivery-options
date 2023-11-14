import {CONFIG, defaultAddress, KEY_ADDRESS, KEY_CONFIG, MYPARCEL, POSTNL} from '@myparcel-do/shared';

describe('ConfigurationMerger', () => {
  it('should merge configurations correctly', () => {
    const config = new ConfigurationMerger(MYPARCEL, {
      [KEY_ADDRESS]: defaultAddress[MYPARCEL],
      [KEY_CONFIG]: {
        [CONFIG.PLATFORM]: MYPARCEL,
        [CONFIG.DROP_OFF_DAYS]: [1, 3, 4],
        [CONFIG.CARRIER_SETTINGS]: {
          [POSTNL]: {
            [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
          },
        },
      },
    });

    const mergedConfiguration = config.getMerged();
    expect(mergedConfiguration[KEY_CONFIG][CONFIG.PLATFORM]).toStrictEqual(MYPARCEL);
    // Check the drop-off days aren't merged into the defaults.
    expect(mergedConfiguration[KEY_CONFIG][CONFIG.DROP_OFF_DAYS]).toStrictEqual([1, 3, 4]);
    // Check the carrier settings are overriding the defaults properly.
    expect(mergedConfiguration[KEY_CONFIG][CONFIG.CARRIER_SETTINGS]).toStrictEqual({
      [POSTNL]: {
        [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
        [CONFIG.ALLOW_SATURDAY_DELIVERY]: false,
        [CONFIG.ALLOW_SAME_DAY_DELIVERY]: false,
      },
    });

    expect(mergedConfiguration[KEY_ADDRESS]).toStrictEqual(defaultAddress[MYPARCEL]);
  });
});
