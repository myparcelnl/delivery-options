import {describe, expect} from 'vitest';
import {CONFIG, defaultAddress, KEY_ADDRESS, KEY_CONFIG} from '@myparcel-do/shared';
import {CarrierName, PlatformName} from '@myparcel/constants';

describe.skip('ConfigurationMerger', () => {
  it('should merge configurations correctly', () => {
    const config = new ConfigurationMerger(PlatformName.MyParcel, {
      [KEY_ADDRESS]: defaultAddress[PlatformName.MyParcel],
      [KEY_CONFIG]: {
        [CONFIG.PLATFORM]: PlatformName.MyParcel,
        [CONFIG.DROP_OFF_DAYS]: [1, 3, 4],
        [CONFIG.CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
            [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
          },
        },
      },
    });

    const mergedConfiguration = config.getMerged();
    expect(mergedConfiguration[KEY_CONFIG][CONFIG.PLATFORM]).toStrictEqual(PlatformName.MyParcel);
    // Check the drop-off days aren't merged into the defaults.
    expect(mergedConfiguration[KEY_CONFIG][CONFIG.DROP_OFF_DAYS]).toStrictEqual([1, 3, 4]);
    // Check the carrier settings are overriding the defaults properly.
    expect(mergedConfiguration[KEY_CONFIG][CONFIG.CARRIER_SETTINGS]).toStrictEqual({
      [CarrierName.PostNl]: {
        [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
        [CONFIG.ALLOW_SATURDAY_DELIVERY]: false,
        [CONFIG.ALLOW_SAME_DAY_DELIVERY]: false,
      },
    });

    expect(mergedConfiguration[KEY_ADDRESS]).toStrictEqual(defaultAddress[PlatformName.MyParcel]);
  });
});
