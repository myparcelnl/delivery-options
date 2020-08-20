import Vue from 'vue';
import { Wrapper } from '@vue/test-utils';
import { configBus } from '@/delivery-options/config/configBus';
import { defaultConfiguration } from '@/config/defaultConfiguration';
import { mockDeliveryOptions } from './mockDeliveryOptions';

describe('app mocking', () => {
  let app;

  it('sets up the default config correctly', async() => {
    app = await mockDeliveryOptions();

    expect(app).toBeInstanceOf(Wrapper);
    expect(configBus).toBeInstanceOf(Vue);

    const { config, strings } = configBus;

    expect({ config, strings, address: {} }).toEqual(defaultConfiguration());
  });
});
