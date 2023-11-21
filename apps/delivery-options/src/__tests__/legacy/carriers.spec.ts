import {describe, expect, it} from 'vitest';
import {merge} from 'radash';
import {
  ALLOW_DELIVERY_OPTIONS,
  ALLOW_PICKUP_LOCATIONS,
  CARRIER_SETTINGS,
  KEY_CONFIG,
  PLATFORM,
  UPDATED_DELIVERY_OPTIONS,
} from '@myparcel-do/shared';
import {CarrierName, PlatformName} from '@myparcel/constants';
import {mockDeliveryOptions} from './mockDeliveryOptions';

describe.skip('carriers', () => {
  const CONFIG_DELIVERY_SINGLE_CARRIER = Object.freeze({
    [KEY_CONFIG]: {
      [PLATFORM]: PlatformName.MyParcel,
      [CARRIER_SETTINGS]: {
        [CarrierName.PostNl]: {
          [ALLOW_DELIVERY_OPTIONS]: true,
        },
      },
    },
  });

  const CUSTOM_CARRIER_IDENTIFIER = `${CarrierName.DhlForYou}:12345`;

  const CONFIG_DELIVERY_CUSTOM_CARRIER = Object.freeze({
    [KEY_CONFIG]: {
      [PLATFORM]: PlatformName.MyParcel,
      [CARRIER_SETTINGS]: {
        [CUSTOM_CARRIER_IDENTIFIER]: {
          [ALLOW_DELIVERY_OPTIONS]: true,
        },
      },
    },
  });

  const CONFIG_DELIVERY_MULTIPLE_CARRIERS = Object.freeze(
    merge(CONFIG_DELIVERY_SINGLE_CARRIER, {
      [KEY_CONFIG]: {
        [CARRIER_SETTINGS]: {
          [CarrierName.DhlForYou]: {
            [ALLOW_DELIVERY_OPTIONS]: true,
          },
        },
      },
    }),
  );

  const CONFIG_PICKUP_MULTIPLE_CARRIERS = Object.freeze({
    [KEY_CONFIG]: {
      [CARRIER_SETTINGS]: {
        [CarrierName.PostNl]: {
          [ALLOW_PICKUP_LOCATIONS]: true,
        },
        [CarrierName.DhlForYou]: {
          [ALLOW_PICKUP_LOCATIONS]: true,
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

  it('shows one carrier', async () => {
    expect.assertions(4);
    const wrapper = await mockDeliveryOptions(CONFIG_DELIVERY_SINGLE_CARRIER);

    const event = await waitForEvent(UPDATED_DELIVERY_OPTIONS);
    const postnl = wrapper.findChoice('carrier', CarrierName.PostNl);
    expect(wrapper.findChoice('carrier', CarrierName.DhlForYou).exists()).toBe(false);
    expect(postnl.exists()).toBe(true);
    expect(wrapper.findChoice('carrier', DHL).exists()).toBe(false);
    expect(event.detail.carrier).toEqual(CarrierName.PostNl);
  });

  it('shows a custom carrier', async () => {
    expect.assertions(2);
    const wrapper = await mockDeliveryOptions(CONFIG_DELIVERY_CUSTOM_CARRIER);

    const event = await waitForEvent(UPDATED_DELIVERY_OPTIONS);
    const customCarrier = wrapper.findChoice('carrier', CUSTOM_CARRIER_IDENTIFIER);

    expect(customCarrier.exists()).toBe(true);
    expect(event.detail.carrier).toEqual(CUSTOM_CARRIER_IDENTIFIER);
  });

  it('can show multiple carriers', async () => {
    expect.assertions(4);
    const wrapper = await mockDeliveryOptions(CONFIG_DELIVERY_MULTIPLE_CARRIERS);

    const event = await waitForEvent(UPDATED_DELIVERY_OPTIONS);

    const postNl = wrapper.findChoice('carrier', CarrierName.PostNl);
    const dhlForYou = wrapper.findChoice('carrier', CarrierName.DhlForYou);
    const bpost = wrapper.findChoice('carrier', CarrierName.Bpost);

    expect(postNl.exists()).toBe(true);
    expect(dhlForYou.exists()).toBe(true);
    expect(bpost.exists()).toBe(false);
    expect(event.detail.carrier).toEqual(CarrierName.PostNl);
  });

  it('shows a carrier logo when there is a single carrier', async () => {
    expect.assertions(2);
    const wrapper = await mockDeliveryOptions(CONFIG_DELIVERY_SINGLE_CARRIER);

    await waitForEvent(UPDATED_DELIVERY_OPTIONS);

    carrierHasImage(wrapper, CarrierName.PostNl);
  });

  it('shows carrier logos when there are multiple carriers', async () => {
    expect.assertions(4);
    const wrapper = await mockDeliveryOptions(CONFIG_DELIVERY_MULTIPLE_CARRIERS);

    await waitForEvent(UPDATED_DELIVERY_OPTIONS);

    carrierHasImage(wrapper, CarrierName.PostNl);
    carrierHasImage(wrapper, CarrierName.DhlForYou);
  });

  it('shows carrier logos in pickup list', async () => {
    expect.assertions(4);
    const wrapper = mockDeliveryOptions(CONFIG_PICKUP_MULTIPLE_CARRIERS);

    await waitForEvent(UPDATED_DELIVERY_OPTIONS);

    carrierHasImage(wrapper, CarrierName.PostNl);
    carrierHasImage(wrapper, CarrierName.DhlForYou);
  });
});
