import {describe, expect, it} from 'vitest';
import {merge} from 'radash';
import {CONFIG, defaultConfiguration, KEY_CONFIG, POSTNL} from '@myparcel-do/shared';
import {mockDeliveryOptions} from './mockDeliveryOptions';

describe('app mocking', () => {
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
      merge({}, defaultConfiguration(), {
        [KEY_CONFIG]: {
          [CONFIG.CARRIER_SETTINGS]: {
            [POSTNL]: {
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
