import * as CONFIG from '@/data/keys/configKeys';
import Pickup from '@/delivery-options/components/Pickup/Pickup';
import { configBus } from '@/delivery-options/config/configBus';
import { createPickupChoices } from '@/delivery-options/data/pickup/createPickupChoices';
import { fakePickupLocationsResponse } from '../../../../mocks/fakePickupLocationsResponse';
import { fetchAllCarriers } from '@/delivery-options/data/carriers/fetchAllCarriers';
import { mockDeliveryOptions } from '@Tests/unit/delivery-options/mockDeliveryOptions';
import { mockVue } from '../../mockVue';

describe('Pickup.vue', () => {
  let wrapper;

  beforeAll(async() => {
    const localVue = mockVue({
      [CONFIG.KEY]: {
        [CONFIG.FEATURE_MAX_PAGE_ITEMS]: 5,
      },
    });

    await fetchAllCarriers();
    configBus.setAdvancedCarrierData();

    const choices = await createPickupChoices();
    wrapper = mockDeliveryOptions(null, {
      localVue,
      propsData: {
        data: {
          choices,
        },
      },
    }, Pickup);
  });

  it('handle finding no pickup locations', async() => {
    expect.assertions(1);
    fakePickupLocationsResponse.mockImplementationOnce(() => []);
    await expect(createPickupChoices()).resolves.toStrictEqual([]);
  });

  it('shows map view by default', () => {
    expect(wrapper.findByTestId('view--map').isVisible()).toBeTruthy();
    expect(wrapper.findByTestId('view--list').exists()).toBeFalsy();
  });

  it('can toggle between list and map view', async() => {
    expect.assertions(2);
    await wrapper.findByTestId('button--list').element.click();

    expect(wrapper.findByTestId('view--map').exists()).toBeFalsy();
    expect(wrapper.findByTestId('view--list').isVisible()).toBeTruthy();
  });

  it('has functional pagination', async() => {
    expect.assertions(3);
    await wrapper.findByTestId('button--list').element.click();

    expect(wrapper.findAllByTestId('pickupLocation').wrappers).toHaveLength(5);
    await wrapper.findByTestId('button--load-more').element.click();
    expect(wrapper.findAllByTestId('pickupLocation').wrappers).toHaveLength(10);
    expect(wrapper.findByTestId('button--load-more').exists()).toBeFalsy();
  });
});
