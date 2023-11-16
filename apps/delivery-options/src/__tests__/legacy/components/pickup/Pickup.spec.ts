import {beforeAll, describe, expect, it} from 'vitest';
import {CONFIG, KEY_CONFIG} from '@myparcel-do/shared';
import {mockDeliveryOptions} from '../../mockDeliveryOptions';
import {createPickupChoices, fetchAllCarriers} from '../../../../legacy/data';

describe.skip('Pickup.vue', () => {
  let wrapper;

  beforeAll(async () => {
    const localVue = mockVue({
      [KEY_CONFIG]: {
        [CONFIG.FEATURE_MAX_PAGE_ITEMS]: 5,
      },
    });

    await fetchAllCarriers();
    configBus.setAdvancedCarrierData();

    const choices = await createPickupChoices();
    wrapper = mockDeliveryOptions(
      null,
      {
        localVue,
        propsData: {
          data: {
            choices,
          },
        },
      },
      Pickup,
    );
  });

  it('handle finding no pickup locations', async () => {
    expect.assertions(1);
    fakePickupLocationsResponse.mockImplementationOnce(() => []);
    await expect(createPickupChoices()).resolves.toStrictEqual([]);
  });

  it('shows map view by default', () => {
    expect(wrapper.findByTestId('view--map').isVisible()).toBeTruthy();
    expect(wrapper.findByTestId('view--list').exists()).toBeFalsy();
  });

  it('can toggle between list and map view', async () => {
    expect.assertions(2);
    await wrapper.findByTestId('button--list').element.click();

    expect(wrapper.findByTestId('view--map').exists()).toBeFalsy();
    expect(wrapper.findByTestId('view--list').isVisible()).toBeTruthy();
  });

  it('has functional pagination', async () => {
    expect.assertions(3);
    await wrapper.findByTestId('button--list').element.click();

    expect(wrapper.findAllByTestId('pickupLocation').wrappers).toHaveLength(5);
    await wrapper.findByTestId('button--load-more').element.click();
    expect(wrapper.findAllByTestId('pickupLocation').wrappers).toHaveLength(10);
    expect(wrapper.findByTestId('button--load-more').exists()).toBeFalsy();
  });
});
