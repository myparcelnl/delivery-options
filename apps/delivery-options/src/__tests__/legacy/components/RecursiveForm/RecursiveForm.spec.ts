import {beforeAll, describe, expect, it} from 'vitest';
import {mount} from '@vue/test-utils';
import {CONFIG, defaultConfiguration, formConfigDelivery, KEY_CONFIG} from '@myparcel-do/shared';
import {CarrierName, PlatformName} from '@myparcel/constants';
import {mockDeliveryOptions} from '../../mockDeliveryOptions';

describe.skip('RecursiveForm.vue', () => {
  let component;

  beforeAll(() => {
    component = mount(RecursiveForm, {
      localVue: mockVue(defaultConfiguration(PlatformName.SendMyParcel)),
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
    const {formatCurrency} = component.vm;
    // The spaces in the expected strings are non-breaking spaces.
    expect(formatCurrency(0)).toBe('€ 0,00');
    expect(formatCurrency(100)).toBe('€ 100,00');
    expect(formatCurrency(24.5)).toBe('€ 24,50');
    expect(formatCurrency(20000)).toBe('€ 20.000,00');
  });

  it('handles "showPrices: false" properly', async () => {
    expect.assertions(2);
    const wrapper = mockDeliveryOptions({
      [KEY_CONFIG]: {
        [CONFIG.PLATFORM]: PlatformName.SendMyParcel,
        [CONFIG.SHOW_PRICES]: false,
        [CONFIG.CARRIER_SETTINGS]: {
          [CarrierName.Bpost]: {
            [CONFIG.PRICE_MORNING_DELIVERY]: 1.23,
            [CONFIG.PRICE_STANDARD_DELIVERY]: 4.56,
          },
        },
      },
    });

    const priceLabel = getPriceLabelFromFormConfig(formConfigDelivery, null, wrapper.vm.$configBus);
    expect(priceLabel).toEqual(null);

    await waitForEvent(UPDATED_DELIVERY_OPTIONS);
    expect(wrapper.findAll('[data-test-id="price"]')).toHaveLength(0);
  });

  it('handles "showPrices: true" properly', async () => {
    expect.assertions(2);
    const wrapper = mockDeliveryOptions({
      [KEY_CONFIG]: {
        [CONFIG.PLATFORM]: PlatformName.SendMyParcel,
        [CONFIG.CARRIER_SETTINGS]: {
          [CarrierName.Bpost]: {
            [CONFIG.ALLOW_MORNING_DELIVERY]: true,
            [CONFIG.PRICE_MORNING_DELIVERY]: 1.23,
            [CONFIG.PRICE_STANDARD_DELIVERY]: 4.56,
          },
        },
      },
    });

    const priceLabel = getPriceLabelFromFormConfig(formConfigDelivery, null, wrapper.vm.$configBus);
    // Morning delivery is not allowed so above settings so standard delivery is the cheapest.
    expect(priceLabel).toEqual('Vanaf € 4,56');

    await waitForEvent(UPDATED_DELIVERY_OPTIONS);
    expect(wrapper.findAll('[data-test-id="price"]')).toHaveLength(2);
  });
});
