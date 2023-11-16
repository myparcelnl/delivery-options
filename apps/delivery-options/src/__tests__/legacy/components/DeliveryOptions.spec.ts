import {describe, expect, it} from 'vitest';
import {
  defaultAddress,
  defaultConfiguration,
  KEY_ADDRESS,
  UPDATE_DELIVERY_OPTIONS,
  UPDATED_DELIVERY_OPTIONS,
} from '@myparcel-do/shared';
import {PlatformName} from '@myparcel/constants';
import {mockDeliveryOptions} from '../mockDeliveryOptions';

const configWithInvalidAddress = {
  ...defaultConfiguration(PlatformName.SendMyParcel),
  [KEY_ADDRESS]: {
    // Invalid because cc is missing
    postalCode: '1234AB',
    number: '1',
  },
};

const configWithValidAddress = {
  ...configWithInvalidAddress,
  [KEY_ADDRESS]: defaultAddress[PlatformName.MyParcel],
};

describe.skip('DeliveryOptions.vue', () => {
  it('checks address requirements', async () => {
    expect.assertions(5);

    // Load with a valid address.
    const wrapper = mockDeliveryOptions(PlatformName.MyParcel);
    wrapper.vm.showAddressErrors = createWaitableMock(wrapper.vm.showAddressErrors);

    await waitForEvent(UPDATED_DELIVERY_OPTIONS);
    expect(wrapper.vm.hasValidAddress).toBe(true);
    expect(wrapper.vm.showAddressErrors).toBeCalledTimes(0);

    // Change address to an invalid address.
    document.dispatchEvent(
      new CustomEvent(UPDATE_DELIVERY_OPTIONS, {
        detail: configWithInvalidAddress,
      }),
    );
    await wrapper.vm.$nextTick();
    await wrapper.vm.showAddressErrors.waitToHaveBeenCalled(1);
    expect(wrapper.vm.hasValidAddress).toBe(false);

    // Change to a valid address again
    document.dispatchEvent(
      new CustomEvent(UPDATE_DELIVERY_OPTIONS, {
        detail: configWithValidAddress,
      }),
    );
    await waitForEvent(UPDATED_DELIVERY_OPTIONS);

    expect(wrapper.vm.showAddressErrors).toBeCalledTimes(1);
    expect(wrapper.vm.hasValidAddress).toBe(true);
  });

  it('shows errors on invalid address response from api', async () => {
    expect.assertions(2);
    fakeDeliveryOptionsResponse.mockImplementation(deliveryOptionsResponseInvalidPostalCode);

    const wrapper = mockDeliveryOptions({
      [KEY_ADDRESS]: {
        ...defaultAddress[PlatformName.MyParcel],
        postalCode: '12',
      },
    });
    wrapper.vm.showAddressErrors = createWaitableMock(wrapper.vm.showAddressErrors);

    await wrapper.vm.showAddressErrors.waitToHaveBeenCalled(1);
    await wrapper.vm.$nextTick();
    expect(wrapper.findByTestId('button--retry').exists()).toBe(true);

    // Change address to a valid address.
    fakeDeliveryOptionsResponse.mockImplementation(deliveryOptionsResponseDefault);
    document.dispatchEvent(
      new CustomEvent(UPDATE_DELIVERY_OPTIONS, {
        detail: configWithValidAddress,
      }),
    );

    await waitForEvent(UPDATED_DELIVERY_OPTIONS);
    expect(wrapper.findByTestId('button--retry').exists()).toBe(false);
  });

  it('only shows itself when necessary', async () => {
    expect.assertions(2);
    const wrapper = mockDeliveryOptions();
    expect(wrapper.vm.hasSomethingToShow).toBe(true);

    document.dispatchEvent(
      new CustomEvent(UPDATE_CONFIG_IN, {
        detail: {
          [KEY_CONFIG]: {
            [CONFIG.PLATFORM]: PlatformName.MyParcel,
            [CONFIG.CARRIER_SETTINGS]: {
              postnl: {
                [CONFIG.ALLOW_DELIVERY_OPTIONS]: false,
                [CONFIG.ALLOW_PICKUP_LOCATIONS]: false,
              },
            },
          },
        },
      }),
    );

    await wrapper.vm.$nextTick();
    expect(wrapper.vm.hasSomethingToShow).toBe(false);
  });

  it('can unselect delivery options', async () => {
    expect.assertions(1);
    const wrapper = mockDeliveryOptions();
    await waitForEvent(UPDATED_DELIVERY_OPTIONS);

    document.dispatchEvent(new Event(DISABLE_DELIVERY_OPTIONS));
    await wrapper.vm.$nextTick();

    expect(wrapper.findAll('input:checked')).toHaveLength(0);
  });

  it('hides and shows delivery options', async () => {
    expect.assertions(2);
    const wrapper = mockDeliveryOptions(PlatformName.SendMyParcel);

    document.dispatchEvent(new Event(HIDE_DELIVERY_OPTIONS));

    // Wait for the "last" update event.
    await waitForEvent(UPDATED_DELIVERY_OPTIONS);
    expect(wrapper.vm.$el).toMatchInlineSnapshot('<!---->');

    document.dispatchEvent(new Event(SHOW_DELIVERY_OPTIONS));
    await waitForEvent(UPDATED_DELIVERY_OPTIONS);
    expect(wrapper.findChoice('delivery', 'deliver').isVisible()).toBeTruthy();
  });

  it('clears all listeners on destroy', () => {
    const wrapper = mockDeliveryOptions(PlatformName.SendMyParcel);

    wrapper.vm.$destroy();
  });
});
