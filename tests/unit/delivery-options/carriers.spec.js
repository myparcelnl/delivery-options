import * as CARRIERS from '@/data/keys/carrierKeys';
import * as CONFIG from '@/data/keys/configKeys';
import * as PLATFORMS from '@/data/keys/platformKeys';
import { UPDATED_DELIVERY_OPTIONS } from '@/config/eventConfig';
import { merge } from 'lodash-es';
import { mockDeliveryOptions } from '@Tests/unit/delivery-options/mockDeliveryOptions';
import { waitForEvent } from '@Tests/waitForEvent';

const CONFIG_DELIVERY_SINGLE_CARRIER = Object.freeze({
  [CONFIG.KEY]: {
    [CONFIG.PLATFORM]: PLATFORMS.MYPARCEL,
    [CONFIG.CARRIER_SETTINGS]: {
      [CARRIERS.POSTNL]: {
        [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
      },
    },
  },
});

const CONFIG_DELIVERY_MULTIPLE_CARRIERS = Object.freeze(merge({}, CONFIG_DELIVERY_SINGLE_CARRIER, {
  [CONFIG.KEY]: {
    [CONFIG.CARRIER_SETTINGS]: {
      [CARRIERS.DHL_FOR_YOU]: {
        [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
      },
    },
  },
}));

const CONFIG_PICKUP_MULTIPLE_CARRIERS = Object.freeze({
  [CONFIG.KEY]: {
    [CONFIG.CARRIER_SETTINGS]: {
      [CARRIERS.POSTNL]: {
        [CONFIG.ALLOW_PICKUP_LOCATIONS]: true,
      },
      [CARRIERS.DHL_FOR_YOU]: {
        [CONFIG.ALLOW_PICKUP_LOCATIONS]: true,
      },
    },
  },
});

const carrierHasImage = (wrapper, carrier) => {
  const postNl = wrapper.findChoice('carrier', carrier);
  const postNlImage = postNl.find('[data-test-id="image"]');
  expect(postNlImage.exists()).toBe(true);
  expect(postNlImage.attributes('src')).toContain('assets.myparcel.nl');
};

describe('carriers', () => {
  it('shows one carrier', async() => {
    expect.assertions(3);
    const wrapper = await mockDeliveryOptions(CONFIG_DELIVERY_SINGLE_CARRIER);

    await waitForEvent(UPDATED_DELIVERY_OPTIONS);
    const postnl = wrapper.findChoice('carrier', CARRIERS.POSTNL);
    expect(wrapper.findChoice('carrier', CARRIERS.DHL_FOR_YOU).exists()).toBe(false);
    expect(postnl.exists()).toBe(true);
    expect(wrapper.findChoice('carrier', CARRIERS.DHL).exists()).toBe(false);
  });

  it('can show multiple carriers', async() => {
    expect.assertions(3);
    const wrapper = await mockDeliveryOptions(CONFIG_DELIVERY_MULTIPLE_CARRIERS);

    await waitForEvent(UPDATED_DELIVERY_OPTIONS);

    const postNl = wrapper.findChoice('carrier', CARRIERS.POSTNL);
    const dhlForYou = wrapper.findChoice('carrier', CARRIERS.DHL_FOR_YOU);
    const bpost = wrapper.findChoice('carrier', CARRIERS.BPOST);

    expect(postNl.exists()).toBe(true);
    expect(dhlForYou.exists()).toBe(true);
    expect(bpost.exists()).toBe(false);
  });

  it('shows a carrier logo when there is a single carrier', async() => {
    expect.assertions(2);
    const wrapper = await mockDeliveryOptions(CONFIG_DELIVERY_SINGLE_CARRIER);

    await waitForEvent(UPDATED_DELIVERY_OPTIONS);

    carrierHasImage(wrapper, CARRIERS.POSTNL);
  });

  it('shows carrier logos when there are multiple carriers', async() => {
    expect.assertions(4);
    const wrapper = await mockDeliveryOptions(CONFIG_DELIVERY_MULTIPLE_CARRIERS);

    await waitForEvent(UPDATED_DELIVERY_OPTIONS);

    carrierHasImage(wrapper, CARRIERS.POSTNL);
    carrierHasImage(wrapper, CARRIERS.DHL_FOR_YOU);
  });

  it('shows carrier logos in pickup list', async() => {
    expect.assertions(4);
    const wrapper = mockDeliveryOptions(CONFIG_PICKUP_MULTIPLE_CARRIERS);

    await waitForEvent(UPDATED_DELIVERY_OPTIONS);

    carrierHasImage(wrapper, CARRIERS.POSTNL);
    carrierHasImage(wrapper, CARRIERS.DHL_FOR_YOU);
  });
});
