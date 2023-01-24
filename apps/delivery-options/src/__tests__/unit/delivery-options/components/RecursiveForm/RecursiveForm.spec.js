import * as CARRIERS from '@/data/keys/carrierKeys';
import * as CONFIG from '@/data/keys/configKeys';
import * as PLATFORMS from '@/data/keys/platformKeys';
import RecursiveForm from '../../components/RecursiveForm/RecursiveForm';
import { UPDATED_DELIVERY_OPTIONS } from '@/config/eventConfig';
import { defaultConfiguration } from '@/config/defaultConfiguration';
import { formConfigDelivery } from '@/config/formConfig';
import { getPriceLabelFromFormConfig } from '../../data/prices/getPriceLabelFromFormConfig';
import { mockDeliveryOptions } from '@Tests/unit/delivery-options/mockDeliveryOptions';
import { mockVue } from '@Tests/unit/delivery-options/mockVue';
import { mount } from '@vue/test-utils';
import { waitForEvent } from '@Tests/waitForEvent';

describe('RecursiveForm.vue', () => {
  let component;

  beforeAll(() => {
    component = mount(RecursiveForm, {
      localVue: mockVue(defaultConfiguration(PLATFORMS.SENDMYPARCEL)),
      propsData: {
        option: {
          name: 'carrier',
          type: 'radio',
          choices: [],
        },
      },
    });
  });

  it('correctly formats prices', () => {
    const { formatCurrency } = component.vm;
    // The spaces in the expected strings are non-breaking spaces.
    expect(formatCurrency(0)).toBe('€ 0,00');
    expect(formatCurrency(100)).toBe('€ 100,00');
    expect(formatCurrency(24.50)).toBe('€ 24,50');
    expect(formatCurrency(20000)).toBe('€ 20.000,00');
  });

  it('handles "showPrices: false" properly', async() => {
    expect.assertions(2);
    const wrapper = mockDeliveryOptions({
      [CONFIG.KEY]: {
        [CONFIG.PLATFORM]: PLATFORMS.SENDMYPARCEL,
        [CONFIG.SHOW_PRICES]: false,
        [CONFIG.CARRIER_SETTINGS]: {
          [CARRIERS.BPOST]: {
            [CONFIG.PRICE_MORNING_DELIVERY]: 1.23,
            [CONFIG.PRICE_STANDARD_DELIVERY]: 4.56,
          },
        },
      },
    });

    const priceLabel = getPriceLabelFromFormConfig(
      formConfigDelivery,
      null,
      wrapper.vm.$configBus,
    );
    expect(priceLabel).toEqual(null);

    await waitForEvent(UPDATED_DELIVERY_OPTIONS);
    expect(wrapper.findAll('[data-test-id="price"]')).toHaveLength(0);
  });

  it('handles "showPrices: true" properly', async() => {
    expect.assertions(2);
    const wrapper = mockDeliveryOptions({
      [CONFIG.KEY]: {
        [CONFIG.PLATFORM]: PLATFORMS.SENDMYPARCEL,
        [CONFIG.CARRIER_SETTINGS]: {
          [CARRIERS.BPOST]: {
            [CONFIG.ALLOW_MORNING_DELIVERY]: true,
            [CONFIG.PRICE_MORNING_DELIVERY]: 1.23,
            [CONFIG.PRICE_STANDARD_DELIVERY]: 4.56,
          },
        },
      },
    });

    const priceLabel = getPriceLabelFromFormConfig(
      formConfigDelivery,
      null,
      wrapper.vm.$configBus,
    );
    // Morning delivery is not allowed so above settings so standard delivery is the cheapest.
    expect(priceLabel).toEqual('Vanaf € 4,56');

    await waitForEvent(UPDATED_DELIVERY_OPTIONS);
    expect(wrapper.findAll('[data-test-id="price"]')).toHaveLength(2);
  });
});
