import { RENDER_DELIVERY_OPTIONS, UPDATED_DELIVERY_OPTIONS, UPDATE_DELIVERY_OPTIONS } from '@/config/eventConfig';
import { MYPARCEL } from '@/data/keys/platformKeys';
import Vue from 'vue';
import { dataTest } from '@Tests/unit/selectors';
import { defaultAddress } from '@/data/defaultAddress';
import { defaultConfiguration } from '@/config/defaultConfiguration';
import { getDefaultCarrierSettings } from '@Tests/unit/delivery-options/defaultCarrierSettings';
import { merge } from 'lodash-es';
import { showDeveloperInfo } from '@/delivery-options/showDeveloperInfo';
import { waitForEvent } from '@Tests/waitForEvent';

const classBase = process.env.VUE_APP_CLASS_BASE;

const createHtml = (id = classBase) => {
  const element = document.createElement('div');
  element.setAttribute('id', id);
  document.body.appendChild(element);
};

describe('main.js', () => {
  beforeAll(async() => {
    createHtml();

    Vue.config.productionTip = false;
    Vue.config.devtools = false;

    await import('@/delivery-options/main');
  });

  it('can show information to developers', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    consoleSpy.mockImplementation(jest.fn());
    showDeveloperInfo();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('renders the delivery options after the first update event', async() => {
    expect.assertions(5);

    const carrierPostNl = dataTest('carrier') + dataTest('postnl', 'choice');
    const deliveryDeliver = dataTest('delivery') + dataTest('deliver', 'choice');
    const deliveryPickup = dataTest('delivery') + dataTest('pickup', 'choice');

    document.dispatchEvent(
      new CustomEvent(UPDATE_DELIVERY_OPTIONS, {
        detail: merge(
          {},
          defaultConfiguration(MYPARCEL),
          getDefaultCarrierSettings(),
          { address: defaultAddress[MYPARCEL] },
        ),
      }),
    );

    // Wait for a response from the delivery options.
    await waitForEvent(UPDATED_DELIVERY_OPTIONS);

    expect(document.querySelector(`#${classBase}`)).toBeNull();
    expect(document.querySelector(`form.${classBase}`)).toBeVisible();

    expect(document.querySelector(deliveryDeliver)).toBeVisible();
    expect(document.querySelector(carrierPostNl)).toBeVisible();
    expect(document.querySelector(deliveryPickup)).toBeVisible();
  });

  it('rerenders the delivery options', async() => {
    expect.assertions(3);
    const alternativeId = 'my-element';

    createHtml(alternativeId);

    document.dispatchEvent(
      new CustomEvent(`${RENDER_DELIVERY_OPTIONS}@v2`, {
        detail: {
          selector: `#${alternativeId}`,
        },
      }),
    );
    await waitForEvent(UPDATED_DELIVERY_OPTIONS);

    expect(document.querySelector(`#${classBase}`)).toBeNull();
    expect(document.querySelector(`#${alternativeId}`)).toBeNull();
    expect(document.querySelector(`form.${classBase}`)).toBeVisible();
  });
});
