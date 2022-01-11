import * as CONFIG from '@/data/keys/configKeys';
import { BPOST, DPD, POSTNL } from '@/data/keys/carrierKeys';
import { SENDMYPARCEL } from '@/data/keys/platformKeys';
import { UPDATED_DELIVERY_OPTIONS } from '@/config/eventConfig';
import { mockDeliveryOptions } from '@Tests/unit/delivery-options/mockDeliveryOptions';
import { waitForEvent } from '@Tests/waitForEvent';

describe('delivery date', () => {
  it('hides delivery date when requested', async() => {
    expect.assertions(3);

    const wrapper = mockDeliveryOptions({
      [CONFIG.KEY]: {
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
