import {describe, expect, it} from 'vitest';
import {
  BPOST,
  CONFIG,
  DPD,
  KEY_CONFIG,
  MYPARCEL,
  POSTNL,
  SENDMYPARCEL,
  UPDATED_DELIVERY_OPTIONS,
} from '@myparcel-do/shared';
import {mockDeliveryOptions} from '../mockDeliveryOptions';

describe('delivery date', () => {
  it('exposes delivery date by default', async () => {
    expect.assertions(1);

    mockDeliveryOptions({
      [KEY_CONFIG]: {
        [CONFIG.PLATFORM]: MYPARCEL,
        [CONFIG.CARRIER_SETTINGS]: {
          [POSTNL]: {
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
        [CONFIG.PLATFORM]: MYPARCEL,
        [CONFIG.FEATURE_SHOW_DELIVERY_DATE]: false,
        [CONFIG.CARRIER_SETTINGS]: {
          [POSTNL]: {
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
        [CONFIG.PLATFORM]: SENDMYPARCEL,
        [CONFIG.DELIVERY_DAYS_WINDOW]: 1,
        [CONFIG.FEATURE_SHOW_DELIVERY_DATE]: true,
        [CONFIG.CARRIER_SETTINGS]: {
          [POSTNL]: {
            [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
            [CONFIG.FEATURE_SHOW_DELIVERY_DATE]: true,
          },
          [BPOST]: {
            [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
            [CONFIG.FEATURE_SHOW_DELIVERY_DATE]: false,
          },
          [DPD]: {
            [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
          },
        },
      },
    });

    await waitForEvent(UPDATED_DELIVERY_OPTIONS);

    const postnl = wrapper.findChoice('carrier', POSTNL);
    expect(postnl.find('[data-test-id="deliveryDate__select__label"]').isVisible()).toBeTruthy();

    const bpost = wrapper.findChoice('carrier', BPOST);
    const bpostInput = wrapper.findChoice('carrier__input', BPOST);
    bpostInput.element.click();
    await waitForEvent(UPDATED_DELIVERY_OPTIONS);
    expect(bpost.find('[data-test-id="deliveryDate__select__label"]').isVisible()).toBeFalsy();

    const dpd = wrapper.findChoice('carrier', DPD);
    const dpdInput = wrapper.findChoice('carrier__input', DPD);
    dpdInput.element.click();
    await waitForEvent(UPDATED_DELIVERY_OPTIONS);
    expect(dpd.find('[data-test-id="deliveryDate__select__label"]').isVisible()).toBeFalsy();
  });
});
