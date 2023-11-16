import {describe, expect, it} from 'vitest';
import {merge} from 'radash';
import {CONFIG, getDefaultConfiguration, KEY_CONFIG} from '@myparcel-do/shared';
import {CarrierName} from '@myparcel/constants';
import {mockDeliveryOptions} from './mockDeliveryOptions';

describe.skip('app mocking', () => {
  let app;

  it('sets up the default config correctly', async () => {
    app = await mockDeliveryOptions();

    expect(app).toBeInstanceOf(Wrapper);
    expect(configBus).toBeInstanceOf(Vue);

    const {config, strings} = configBus;

    expect({
      config,
      strings,
      address: {},
    }).toEqual(
      merge({}, getDefaultConfiguration(), {
        [KEY_CONFIG]: {
          [CONFIG.CARRIER_SETTINGS]: {
            [CarrierName.PostNl]: {
              [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
              // Disabled by ConfigurationMerger
              [CONFIG.ALLOW_SAME_DAY_DELIVERY]: false,
              [CONFIG.ALLOW_SATURDAY_DELIVERY]: false,
            },
          },
        },
      }),
    );
  });
});
