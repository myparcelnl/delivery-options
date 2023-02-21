import * as CARRIERS from '@/data/keys/carrierKeys';
import * as CONFIG from '@/data/keys/configKeys';
import * as PLATFORMS from '@/data/keys/platformKeys';
import { UPDATED_DELIVERY_OPTIONS } from '@/config/eventConfig';
import { merge } from 'lodash-es';
import { mockDeliveryOptions } from '@Tests/unit/delivery-options/mockDeliveryOptions';
import { waitForEvent } from '@Tests/waitForEvent';

const CONFIG_SINGLE_CARRIER = Object.freeze({
  [CONFIG.KEY]: {
    [CONFIG.PLATFORM]: PLATFORMS.MYPARCEL,
    [CONFIG.CARRIER_SETTINGS]: {
      [CARRIERS.POSTNL]: {
        [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
      },
    },
  },
});

const CONFIG_MULTIPLE_CARRIERS = Object.freeze(merge({}, CONFIG_SINGLE_CARRIER, {
  [CONFIG.KEY]: {
    [CONFIG.CARRIER_SETTINGS]: {
      [CARRIERS.DHL_FOR_YOU]: {
        [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
      },
    },
  },
}));

describe('carriers', () => {
  it('shows one carrier', async() => {
    expect.assertions(3);
    const app = await mockDeliveryOptions(CONFIG_SINGLE_CARRIER);

    await waitForEvent(UPDATED_DELIVERY_OPTIONS);
    const postnl = app.findChoice('carrier', CARRIERS.POSTNL);
    expect(app.findChoice('carrier', CARRIERS.DHL_FOR_YOU).exists()).toBe(false);
    expect(postnl.exists()).toBe(true);
    expect(app.findChoice('carrier', CARRIERS.DHL).exists()).toBe(false);
  });

  it('can show multiple carriers', async() => {
    expect.assertions(5);
    const app = await mockDeliveryOptions(CONFIG_MULTIPLE_CARRIERS);

    await waitForEvent(UPDATED_DELIVERY_OPTIONS);

    const postNl = app.findChoice('carrier', CARRIERS.POSTNL);
    const dhlForYou = app.findChoice('carrier', CARRIERS.DHL_FOR_YOU);
    const bpost = app.findChoice('carrier', CARRIERS.BPOST);

    expect(postNl.exists()).toBe(true);
    expect(dhlForYou.exists()).toBe(true);
    expect(bpost.exists()).toBe(false);

    expect(postNl.find('[data-test-id="image"]').exists()).toBe(true);
    expect(dhlForYou.find('[data-test-id="image"]').exists()).toBe(true);
  });

  it('does not show a carrier logo when there is only one carrier', async() => {
    const app = await mockDeliveryOptions(CONFIG_SINGLE_CARRIER);

    await waitForEvent(UPDATED_DELIVERY_OPTIONS);

    const postNl = app.findChoice('carrier', CARRIERS.POSTNL);

    expect(postNl.find('[data-test-id="image"]').exists()).toBe(false);
  });

  it('shows carrier logos when there are multiple carriers', async() => {
    expect.assertions(2);
    const app = await mockDeliveryOptions(CONFIG_MULTIPLE_CARRIERS);

    await waitForEvent(UPDATED_DELIVERY_OPTIONS);

    const postNl = app.findChoice('carrier', CARRIERS.POSTNL);
    const dhlForYou = app.findChoice('carrier', CARRIERS.DHL_FOR_YOU);

    expect(postNl.find('[data-test-id="image"]').exists()).toBe(true);
    expect(dhlForYou.find('[data-test-id="image"]').exists()).toBe(true);
  });
});
