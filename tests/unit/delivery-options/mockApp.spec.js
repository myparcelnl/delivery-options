import * as CONFIG from '@/data/keys/configKeys';
import { POSTNL } from '@/data/keys/carrierKeys';
import Vue from 'vue';
import { Wrapper } from '@vue/test-utils';
import { configBus } from '@/delivery-options/config/configBus';
import { defaultConfiguration } from '@/config/defaultConfiguration';
import { merge } from 'lodash-es';
import { mockDeliveryOptions } from './mockDeliveryOptions';

describe('app mocking', () => {
  let app;

  it('sets up the default config correctly', async() => {
    app = await mockDeliveryOptions();

    expect(app).toBeInstanceOf(Wrapper);
    expect(configBus).toBeInstanceOf(Vue);

    const { config, strings } = configBus;

    expect({ config, strings, address: {} }).toEqual(merge({}, defaultConfiguration(), {
      [CONFIG.KEY]: {
        [CONFIG.CARRIER_SETTINGS]: {
          [POSTNL]: {
            [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
            // Disabled by ConfigurationMerger
            [CONFIG.ALLOW_SAME_DAY_DELIVERY]: false,
            [CONFIG.ALLOW_SATURDAY_DELIVERY]: false,
          },
        },
      },
    }));
  });
});
