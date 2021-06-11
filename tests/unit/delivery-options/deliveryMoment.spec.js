import * as CARRIERS from '@/data/keys/carrierKeys';
import * as CONFIG from '@/data/keys/configKeys';
import { MYPARCEL, SENDMYPARCEL } from '@/data/keys/platformKeys';
import MockDate from 'mockdate';
import { UPDATED_DELIVERY_OPTIONS } from '@/config/eventConfig';
import { mockDeliveryOptions } from '@Tests/unit/delivery-options/mockDeliveryOptions';
import { waitForEvent } from '@Tests/waitForEvent';

// Timestamps are before all cutoff times
const FRIDAY = '2020-03-13T10:00:00';
const SATURDAY = '2020-03-14T10:00:00';

const configMyParcel = {
  [CONFIG.PLATFORM]: MYPARCEL,
  [CONFIG.DELIVERY_DAYS_WINDOW]: 7,
  // Includes Saturday
  [CONFIG.DROP_OFF_DAYS]: [1, 2, 3, 4, 5, 6],
  [CONFIG.DROP_OFF_DELAY]: 0,
  [CONFIG.SATURDAY_CUTOFF_TIME]: '14:30',
  [CONFIG.ALLOW_MONDAY_DELIVERY]: true,
};

/**
 * Delivery days window is always the same for SendMyParcel so it doesn't need to be set.
 *
 * @see @/delivery-options/data/request/requestData:9
 */
const configSendMyParcel = {
  [CONFIG.PLATFORM]: SENDMYPARCEL,

  // Includes Friday
  [CONFIG.DROP_OFF_DAYS]: [1, 2, 3, 4, 5],
  [CONFIG.DROP_OFF_DELAY]: 0,
  [CONFIG.FRIDAY_CUTOFF_TIME]: '14:30',
  [CONFIG.ALLOW_SATURDAY_DELIVERY]: true,

  [CONFIG.CARRIER_SETTINGS]: {
    [CARRIERS.BPOST]: {
      [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
    },
  },
};

/**
 * Mock delivery options and returns the array of visible choices for the delivery date option.
 *
 * @param {Object} config
 *
 * @returns {String[]}
 */
async function getMockedDeliveryDateChoices(config) {
  const wrapper = mockDeliveryOptions({
    [CONFIG.KEY]: config,
  });
  await waitForEvent(UPDATED_DELIVERY_OPTIONS);

  let wrappers;
  const deliveryDateOption = wrapper.findByTestId('deliveryDate__select__label');

  // When delivery days window is 1 the only option is shown as text instead of a select option.
  if (deliveryDateOption.exists()) {
    wrappers = [deliveryDateOption];
  } else {
    wrappers = wrapper.findAllByTestId('deliveryDate__select__option').wrappers;
  }

  return wrappers.map((wrapper) => wrapper.element.getAttribute('data-test-choice'));
}

describe('Delivery moments', () => {
  afterEach(() => {
    MockDate.reset();
  });

  test('can show monday delivery', async() => {
    expect.assertions(1);
    MockDate.set(SATURDAY);

    const choices = await getMockedDeliveryDateChoices(configMyParcel);

    // Monday to Saturday and the Monday after
    expect(choices).toStrictEqual([
      '2020-03-16T00:00:00.000Z',
      '2020-03-17T00:00:00.000Z',
      '2020-03-18T00:00:00.000Z',
      '2020-03-19T00:00:00.000Z',
      '2020-03-20T00:00:00.000Z',
      '2020-03-21T00:00:00.000Z',
      // Sunday: disallowed
      '2020-03-23T00:00:00.000Z',
    ]);
  });

  it('does not show monday delivery when "allow_monday_delivery" is false', async() => {
    expect.assertions(1);
    MockDate.set(SATURDAY);

    const choices = await getMockedDeliveryDateChoices({
      ...configMyParcel,
      [CONFIG.ALLOW_MONDAY_DELIVERY]: false,
    });

    // Tuesday to Saturday and the next Tuesday and Wednesday
    expect(choices).toStrictEqual([
      '2020-03-17T00:00:00.000Z',
      '2020-03-18T00:00:00.000Z',
      '2020-03-19T00:00:00.000Z',
      '2020-03-20T00:00:00.000Z',
      '2020-03-21T00:00:00.000Z',
      // Sunday: disallowed
      // Monday: disallowed
      '2020-03-24T00:00:00.000Z',
      '2020-03-25T00:00:00.000Z',
    ]);
  });

  it('does not show monday delivery when saturday is not a drop-off day', async() => {
    expect.assertions(1);
    MockDate.set(SATURDAY);

    const choicesWithMissingDropOffDay = await getMockedDeliveryDateChoices({
      ...configMyParcel,
      // Saturday is missing
      [CONFIG.DROP_OFF_DAYS]: [1, 2, 3, 4, 5],
    });

    // Tuesday to Saturday and the next Tuesday and Wednesday
    expect(choicesWithMissingDropOffDay).toStrictEqual([
      '2020-03-17T00:00:00.000Z',
      '2020-03-18T00:00:00.000Z',
      '2020-03-19T00:00:00.000Z',
      '2020-03-20T00:00:00.000Z',
      '2020-03-21T00:00:00.000Z',
      // Sunday: disallowed
      // Monday: disallowed
      '2020-03-24T00:00:00.000Z',
      '2020-03-25T00:00:00.000Z',
    ]);
  });

  test('can show saturday delivery', async() => {
    expect.assertions(1);
    MockDate.set(FRIDAY);

    const choicesWithMissingDropOffDay = await getMockedDeliveryDateChoices(configSendMyParcel);

    // Only Saturday
    expect(choicesWithMissingDropOffDay).toStrictEqual([
      '2020-03-14T00:00:00.000Z',
    ]);
  });

  it('does not show saturday delivery when "allow_saturday_delivery" is false', async() => {
    expect.assertions(1);
    MockDate.set(FRIDAY);

    const choices = await getMockedDeliveryDateChoices({
      ...configSendMyParcel,
      [CONFIG.ALLOW_SATURDAY_DELIVERY]: false,
    });

    // Tuesday because Monday's dropoff day, Sunday, is not a dropoff day.
    expect(choices).toStrictEqual([
      '2020-03-17T00:00:00.000Z',
    ]);
  });

  it('does not show saturday delivery when friday is not a drop-off day', async() => {
    expect.assertions(1);
    MockDate.set(FRIDAY);

    const choices = await getMockedDeliveryDateChoices({
      ...configSendMyParcel,
      [CONFIG.DROP_OFF_DAYS]: [1, 2, 3, 4, 0],
    });

    // Monday because Sunday is a dropoff day.
    expect(choices).toStrictEqual([
      '2020-03-16T00:00:00.000Z',
    ]);
  });

  it('hides delivery date when requested', async() => {
    expect.assertions(3);

    const wrapper = mockDeliveryOptions({
      [CONFIG.KEY]: {
        [CONFIG.PLATFORM]: SENDMYPARCEL,
        [CONFIG.DELIVERY_DAYS_WINDOW]: 1,
        [CONFIG.FEATURE_ALLOW_SHOW_DELIVERY_DATE]: true,
        [CONFIG.CARRIER_SETTINGS]: {
          [CARRIERS.POSTNL]: {
            [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
            [CONFIG.FEATURE_ALLOW_SHOW_DELIVERY_DATE]: true,
          },
          [CARRIERS.BPOST]: {
            [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
            [CONFIG.FEATURE_ALLOW_SHOW_DELIVERY_DATE]: false,
          },
          [CARRIERS.DPD]: {
            [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
          },
        },
      },
    });

    await waitForEvent(UPDATED_DELIVERY_OPTIONS);

    const postnl = wrapper.findChoice('carrier', CARRIERS.POSTNL);
    expect(postnl.find('[data-test-id="deliveryDate__select__label"]').element).toBeVisible();

    const bpost = wrapper.findChoice('carrier', CARRIERS.BPOST);
    const bpostInput = wrapper.findChoice('carrier__input', CARRIERS.BPOST);
    bpostInput.element.click();
    await waitForEvent(UPDATED_DELIVERY_OPTIONS);
    expect(bpost.find('[data-test-id="deliveryDate__select__label"]').element).not.toBeVisible();

    const dpd = wrapper.findChoice('carrier', CARRIERS.DPD);
    const dpdInput = wrapper.findChoice('carrier__input', CARRIERS.DPD);
    dpdInput.element.click();
    await waitForEvent(UPDATED_DELIVERY_OPTIONS);
    expect(dpd.find('[data-test-id="deliveryDate__select__label"]').element).toBeVisible();
  });
});
