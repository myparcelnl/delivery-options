import {describe, expect, it} from 'vitest';
import {CONFIG, KEY_CONFIG, UPDATED_DELIVERY_OPTIONS} from '@myparcel-do/shared';
import {CarrierName, PlatformName} from '@myparcel/constants';
import {mockDeliveryOptions} from '../mockDeliveryOptions';

describe.skip('delivery date', () => {
  it('exposes delivery date by default', async () => {
    expect.assertions(1);

    mockDeliveryOptions({
      [KEY_CONFIG]: {
        [CONFIG.PLATFORM]: PlatformName.MyParcel,
        [CONFIG.CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
            [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
          },
        },
      },
    });

    const event = await waitForEvent(UPDATED_DELIVERY_OPTIONS);
    expect(event.detail.date).not.toBeNull();
  });

  it("does not expose delivery date when it's turned off", async () => {
    expect.assertions(1);

    mockDeliveryOptions({
      [KEY_CONFIG]: {
        [CONFIG.PLATFORM]: PlatformName.MyParcel,
        [CONFIG.FEATURE_SHOW_DELIVERY_DATE]: false,
        [CONFIG.CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
            [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
          },
        },
      },
    });

    const event = await waitForEvent(UPDATED_DELIVERY_OPTIONS);
    expect(event.detail.date).toBeNull();
  });

  it('hides delivery date when requested', async () => {
    expect.assertions(3);

    const wrapper = mockDeliveryOptions({
      [KEY_CONFIG]: {
        [CONFIG.PLATFORM]: PlatformName.SendMyParcel,
        [CONFIG.DELIVERY_DAYS_WINDOW]: 1,
        [CONFIG.FEATURE_SHOW_DELIVERY_DATE]: true,
        [CONFIG.CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
            [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
            [CONFIG.FEATURE_SHOW_DELIVERY_DATE]: true,
          },
          [CarrierName.Bpost]: {
            [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
            [CONFIG.FEATURE_SHOW_DELIVERY_DATE]: false,
          },
          [CarrierName.Dpd]: {
            [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
          },
        },
      },
    });

    await waitForEvent(UPDATED_DELIVERY_OPTIONS);

    const postnl = wrapper.findChoice('carrier', CarrierName.PostNl);
    expect(postnl.find('[data-test-id="deliveryDate__select__label"]').isVisible()).toBeTruthy();

    const bpost = wrapper.findChoice('carrier', CarrierName.Bpost);
    const bpostInput = wrapper.findChoice('carrier__input', CarrierName.Bpost);
    bpostInput.element.click();
    await waitForEvent(UPDATED_DELIVERY_OPTIONS);
    expect(bpost.find('[data-test-id="deliveryDate__select__label"]').isVisible()).toBeFalsy();

    const dpd = wrapper.findChoice('carrier', CarrierName.Dpd);
    const dpdInput = wrapper.findChoice('carrier__input', CarrierName.Dpd);
    dpdInput.element.click();
    await waitForEvent(UPDATED_DELIVERY_OPTIONS);
    expect(dpd.find('[data-test-id="deliveryDate__select__label"]').isVisible()).toBeFalsy();
  });
});
