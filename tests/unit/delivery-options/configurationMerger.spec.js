import * as ADDRESS from '@/data/keys/addressKeys';
import * as CONFIG from '@/data/keys/configKeys';
import { ConfigurationMerger } from '@/delivery-options/config/configurationMerger';
import { MYPARCEL } from '@/data/keys/platformKeys';
import { POSTNL } from '@/data/keys/carrierKeys';
import { defaultAddress } from '@/data/defaultAddress';

describe('ConfigurationMerger', () => {
  it('should merge configurations correctly', () => {
    const config = new ConfigurationMerger(MYPARCEL, {
      [ADDRESS.KEY]: defaultAddress[MYPARCEL],
      [CONFIG.KEY]: {
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
    expect(mergedConfiguration[CONFIG.KEY][CONFIG.PLATFORM]).toStrictEqual(MYPARCEL);
    // Check the drop-off days aren't merged into the defaults.
    expect(mergedConfiguration[CONFIG.KEY][CONFIG.DROP_OFF_DAYS]).toStrictEqual([1, 3, 4]);
    // Check the carrier settings are overriding the defaults properly.
    expect(mergedConfiguration[CONFIG.KEY][CONFIG.CARRIER_SETTINGS]).toStrictEqual({
      [POSTNL]: {
        [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
        [CONFIG.ALLOW_SATURDAY_DELIVERY]: false,
        [CONFIG.ALLOW_SAME_DAY_DELIVERY]: false,
      },
    });

    expect(mergedConfiguration[ADDRESS.KEY]).toStrictEqual(defaultAddress[MYPARCEL]);
  });
});
