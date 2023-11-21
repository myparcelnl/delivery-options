import {beforeAll, describe, expect, it, vi} from 'vitest';
import {merge} from 'radash';
import {
  defaultAddress,
  getDefaultConfiguration,
  UPDATE_DELIVERY_OPTIONS,
  UPDATED_DELIVERY_OPTIONS,
} from '@myparcel-do/shared';
import {PlatformName} from '@myparcel/constants';
import {getDefaultCarrierSettings} from '../defaultCarrierSettings';
import {showDeveloperInfo} from '../../../legacy/showDeveloperInfo';

describe.skip('main.js', () => {
  const classBase = process.env.VUE_APP_CLASS_BASE;

  const createHtml = (id = classBase) => {
    const element = document.createElement('div');
    element.setAttribute('id', id);
    document.body.appendChild(element);
  };

  beforeAll(async () => {
    createHtml();
  });

  it('can show information to developers', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    consoleSpy.mockImplementation(vi.fn());
    showDeveloperInfo();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('renders the delivery options after the first update event', async () => {
    expect.assertions(5);

    const carrierPostNl = dataTest('carrier') + dataTest('postnl', 'choice');
    const deliveryDeliver = dataTest('delivery') + dataTest('deliver', 'choice');
    const deliveryPickup = dataTest('delivery') + dataTest('pickup', 'choice');

    document.dispatchEvent(
      new CustomEvent(UPDATE_DELIVERY_OPTIONS, {
        detail: merge({}, getDefaultConfiguration(PlatformName.MyParcel), getDefaultCarrierSettings(), {
          address: defaultAddress[PlatformName.MyParcel],
        }),
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

  it('rerenders the delivery options', async () => {
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
