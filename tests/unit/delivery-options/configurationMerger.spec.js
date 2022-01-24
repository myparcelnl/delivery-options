import * as ADDRESS from '@/data/keys/addressKeys';
import * as CARRIERS from '@/data/keys/carrierKeys';
import * as CONFIG from '@/data/keys/configKeys';
import { ConfigurationMerger } from '@/delivery-options/config/configurationMerger';
import { MYPARCEL } from '@/data/keys/platformKeys';
import { defaultAddress } from '@/data/defaultAddress';

describe('ConfigurationMerger', () => {
  it('should merge configurations correctly', () => {
    const config = new ConfigurationMerger(MYPARCEL, {
      [ADDRESS.KEY]: defaultAddress[MYPARCEL],
      [CONFIG.KEY]: {
        [CONFIG.PLATFORM]: MYPARCEL,
        [CONFIG.DROP_OFF_DAYS]: [1, 3, 4],
        [CONFIG.CARRIER_SETTINGS]: {
          [CARRIERS.INSTABOX]: {
            [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
          },
        },
      },
    });

    const mergedConfiguration = config.getMerged();
    expect(mergedConfiguration[CONFIG.KEY][CONFIG.PLATFORM]).toStrictEqual(MYPARCEL);
    // Check the drop-off days aren't merged into the defaults.
    expect(mergedConfiguration[CONFIG.KEY][CONFIG.DROP_OFF_DAYS]).toStrictEqual([1, 3, 4]);
    // Check the carrier settings are overriding the defaults properly.
    expect(mergedConfiguration[CONFIG.KEY][CONFIG.CARRIER_SETTINGS]).toStrictEqual({
      [CARRIERS.INSTABOX]: {
        [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
        [CONFIG.ALLOW_EVENING_DELIVERY]: false,
        [CONFIG.ALLOW_MONDAY_DELIVERY]: false,
        [CONFIG.ALLOW_MORNING_DELIVERY]: false,
        [CONFIG.ALLOW_PACKAGE_TYPE_DIGITAL_STAMP]: false,
        [CONFIG.ALLOW_SATURDAY_DELIVERY]: false,
        [CONFIG.ALLOW_PICKUP_LOCATIONS]: false,
        [CONFIG.ALLOW_SIGNATURE]: false,
      },
    });

    expect(mergedConfiguration[ADDRESS.KEY]).toStrictEqual(defaultAddress[MYPARCEL]);
  });
});
