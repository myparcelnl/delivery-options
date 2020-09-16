import * as ADDRESS from '@/data/keys/addressKeys';
import * as CONFIG from '@/data/keys/configKeys';
import {
  DISABLE_DELIVERY_OPTIONS,
  HIDE_DELIVERY_OPTIONS, SHOW_DELIVERY_OPTIONS, UPDATED_DELIVERY_OPTIONS, UPDATE_CONFIG_IN, UPDATE_DELIVERY_OPTIONS,
} from '@/config/eventConfig';
import { MYPARCEL, SENDMYPARCEL } from '@/data/keys/platformKeys';
import { createWaitableMock } from '@Tests/unit/createWaitableMock';
import { defaultAddress } from '@/data/defaultAddress';
import { defaultConfiguration } from '@/config/defaultConfiguration';
import { mockDeliveryOptions } from '@Tests/unit/delivery-options/mockDeliveryOptions';
import { waitForEvent } from '@Tests/WaitForEvent';

const configWithInvalidAddress = {
  ...defaultConfiguration(SENDMYPARCEL),
  [ADDRESS.KEY]: {
    cc: 'nl',
    postalCode: '1234',
    // Invalid because number is missing
  },
};

const configWithValidAddress = {
  ...configWithInvalidAddress,
  [ADDRESS.KEY]: defaultAddress[MYPARCEL],
};

describe('DeliveryOptions.vue', () => {
  let app;

  it('checks address requirements', async() => {
    expect.assertions(6);

    // Load with a valid address.
    app = mockDeliveryOptions(MYPARCEL);
    app.vm.showAddressErrors = createWaitableMock(app.vm.showAddressErrors);

    await waitForEvent(UPDATED_DELIVERY_OPTIONS);
    expect(app.vm.hasValidAddress).toBe(true);
    expect(app.vm.showAddressErrors).toBeCalledTimes(0);

    // Change address to an invalid address.
    document.dispatchEvent(new CustomEvent(UPDATE_DELIVERY_OPTIONS, { detail: configWithInvalidAddress }));
    await app.vm.$nextTick();
    await app.vm.showAddressErrors.waitToHaveBeenCalled(1);
    expect(app.vm.hasValidAddress).toBe(false);
    expect(app.vm.showAddressErrors).toBeCalledTimes(2);

    // Change to a valid address again
    document.dispatchEvent(new CustomEvent(UPDATE_DELIVERY_OPTIONS, { detail: configWithValidAddress }));
    await app.vm.$nextTick();
    await waitForEvent(UPDATED_DELIVERY_OPTIONS);
    expect(app.vm.showAddressErrors).toBeCalledTimes(2);

    await app.vm.$nextTick();
    expect(app.vm.hasValidAddress).toBe(true);
  });

  it('only shows itself when necessary', async() => {
    expect.assertions(2);
    app = mockDeliveryOptions();
    expect(app.vm.hasSomethingToShow).toBe(true);

    document.dispatchEvent(new CustomEvent(UPDATE_CONFIG_IN, {
      detail: {
        [CONFIG.KEY]: {
          [CONFIG.PLATFORM]: MYPARCEL,
          [CONFIG.CARRIER_SETTINGS]: {
            postnl: {
              [CONFIG.ALLOW_DELIVERY_OPTIONS]: false,
              [CONFIG.ALLOW_PICKUP_LOCATIONS]: false,
            },
          },
        },
      },
    }));

    await app.vm.$nextTick();
    expect(app.vm.hasSomethingToShow).toBe(false);
  });

  it('can unselect delivery options', async() => {
    expect.assertions(4);
    app = mockDeliveryOptions(MYPARCEL);

    await waitForEvent(UPDATED_DELIVERY_OPTIONS);
    expect(app.findChoice('delivery__input', 'deliver').element).toBeChecked();
    expect(app.findChoice('deliveryMoment__input', 'standard').element).toBeChecked();
    expect(app.findAll('input:checked').wrappers).toHaveLength(2);

    document.dispatchEvent(new Event(DISABLE_DELIVERY_OPTIONS));
    await app.vm.$nextTick();
    expect(app.findAll('input:checked')).toHaveLength(0);
  });

  it('hides and shows delivery options', async() => {
    expect.assertions(2);
    app = mockDeliveryOptions(SENDMYPARCEL);

    document.dispatchEvent(new Event(HIDE_DELIVERY_OPTIONS));

    // Wait for the "last" update event.
    await waitForEvent(UPDATED_DELIVERY_OPTIONS);
    expect(app.vm.$el).toMatchInlineSnapshot('<!---->');

    document.dispatchEvent(new Event(SHOW_DELIVERY_OPTIONS));
    await waitForEvent(UPDATED_DELIVERY_OPTIONS);
    expect(app.findChoice('delivery', 'deliver').element).toBeVisible();
  });

  it('clears all listeners on destroy', () => {
    app = mockDeliveryOptions(SENDMYPARCEL);

    app.vm.$destroy();
  });
});
