import * as CONFIG from '@/data/keys/configKeys';
import { BPOST, DPD, POSTNL, RED_JE_PAKKETJE } from '@/data/keys/carrierKeys';
import { FRIDAY, MONDAY, SATURDAY, SUNDAY, THURSDAY, TUESDAY, WEDNESDAY } from '@/config/extraDeliveryConfig';
import { MYPARCEL, SENDMYPARCEL } from '@/data/keys/platformKeys';
import MockDate from 'mockdate';
import { UPDATED_DELIVERY_OPTIONS } from '@/config/eventConfig';
import { checkIsDropOffDay } from '@/delivery-options/data/request/checkIsDropOffDay';
import dayjs from 'dayjs';
import { getExtraDropOffDay } from '@/delivery-options/data/request/getExtraDropOffDay';
import { getMockedDeliveryDateChoices } from '@Tests/helpers/getMockedDeliveryDateChoices';
import { mockConfigBus } from '@Tests/unit/delivery-options/mockConfigBus';
import { mockDeliveryOptions } from '@Tests/unit/delivery-options/mockDeliveryOptions';
import { waitForEvent } from '@Tests/waitForEvent';

// Timestamps are before all cutoff times
const DATE_FRIDAY = '2020-03-13T10:00:00Z';
const DATE_SATURDAY = '2020-03-14T10:00:00Z';

// After all cutoff times
const DATE_FRIDAY_AFTER_CUTOFF = '2020-03-13T18:00:00Z';
const DATE_SATURDAY_AFTER_CUTOFF = '2020-03-14T18:00:00Z';

const configMyParcel = {
  [CONFIG.PLATFORM]: MYPARCEL,
  [CONFIG.DELIVERY_DAYS_WINDOW]: 7,
  // Includes Saturday
  [CONFIG.DROP_OFF_DAYS]: [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY],
  [CONFIG.DROP_OFF_DELAY]: 0,
  [CONFIG.SATURDAY_CUTOFF_TIME]: '14:30',
  [CONFIG.ALLOW_MONDAY_DELIVERY]: true,
};

/**
 * Delivery days window is always the same for SendMyParcel, so it doesn't need to be set.
 *
 * @see @/delivery-options/data/request/requestData:9
 */
const configSendMyParcel = {
  [CONFIG.PLATFORM]: SENDMYPARCEL,

  // Includes Friday
  [CONFIG.DROP_OFF_DAYS]: [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY],
  [CONFIG.DROP_OFF_DELAY]: 0,
  [CONFIG.FRIDAY_CUTOFF_TIME]: '14:30',
  [CONFIG.ALLOW_SATURDAY_DELIVERY]: true,

  [CONFIG.CARRIER_SETTINGS]: {
    [BPOST]: {
      [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
    },
  },
};

describe('Delivery moments', () => {
  afterEach(() => {
    MockDate.reset();
  });

  test('can show monday delivery', async() => {
    expect.assertions(1);
    MockDate.set(DATE_SATURDAY);

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
    MockDate.set(DATE_SATURDAY);

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
    MockDate.set(DATE_SATURDAY);

    const choicesWithMissingDropOffDay = await getMockedDeliveryDateChoices({
      ...configMyParcel,
      // No Saturday.
      [CONFIG.DROP_OFF_DAYS]: [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY],
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

  it('does not show monday delivery when the saturday cutoff time has passed', async() => {
    expect.assertions(1);
    MockDate.set(DATE_SATURDAY_AFTER_CUTOFF);

    const choices = await getMockedDeliveryDateChoices({
      ...configMyParcel,
      // No Sunday.
      [CONFIG.DROP_OFF_DAYS]: [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY],
    });

    expect(choices).toStrictEqual([
      // Monday: disallowed because Saturday cutoff time has passed
      '2020-03-17T00:00:00.000Z',
      '2020-03-18T00:00:00.000Z',
      '2020-03-19T00:00:00.000Z',
      '2020-03-20T00:00:00.000Z',
      '2020-03-21T00:00:00.000Z',
      // Sunday: disallowed
      '2020-03-23T00:00:00.000Z',
      '2020-03-24T00:00:00.000Z',
    ]);
  });

  test('can show saturday delivery', async() => {
    expect.assertions(1);
    MockDate.set(DATE_FRIDAY);

    const choicesWithMissingDropOffDay = await getMockedDeliveryDateChoices(configSendMyParcel);

    // Only Saturday
    expect(choicesWithMissingDropOffDay).toStrictEqual([
      '2020-03-14T00:00:00.000Z',
    ]);
  });

  it('does not show saturday delivery when "allow_saturday_delivery" is false', async() => {
    expect.assertions(1);
    MockDate.set(DATE_FRIDAY);

    const choices = await getMockedDeliveryDateChoices({
      ...configSendMyParcel,
      [CONFIG.ALLOW_SATURDAY_DELIVERY]: false,
    });

    // Next Monday.
    expect(choices).toStrictEqual([
      '2020-03-16T00:00:00.000Z',
    ]);
  });

  it('does not show saturday delivery when friday is not a drop-off day', async() => {
    expect.assertions(1);
    MockDate.set(DATE_FRIDAY);

    const choices = await getMockedDeliveryDateChoices({
      ...configSendMyParcel,
      [CONFIG.DROP_OFF_DAYS]: [SUNDAY, MONDAY, TUESDAY, WEDNESDAY],
    });

    // Monday because Sunday is a dropoff day.
    expect(choices).toStrictEqual([
      '2020-03-16T00:00:00.000Z',
    ]);
  });

  it('does not show saturday delivery when the friday cutoff time has passed', async() => {
    expect.assertions(1);
    MockDate.set(DATE_FRIDAY_AFTER_CUTOFF);

    const choices = await getMockedDeliveryDateChoices(configSendMyParcel);

    // Tuesday because Monday to Friday are dropoff days.
    expect(choices).toStrictEqual([
      '2020-03-17T00:00:00.000Z',
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
          [POSTNL]: {
            [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
            [CONFIG.FEATURE_ALLOW_SHOW_DELIVERY_DATE]: true,
          },
          [BPOST]: {
            [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
            [CONFIG.FEATURE_ALLOW_SHOW_DELIVERY_DATE]: false,
          },
          [DPD]: {
            [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
          },
        },
      },
    });

    await waitForEvent(UPDATED_DELIVERY_OPTIONS);

    const postnl = wrapper.findChoice('carrier', POSTNL);
    expect(postnl.find('[data-test-id="deliveryDate__select__label"]').element).toBeVisible();

    const bpost = wrapper.findChoice('carrier', BPOST);
    const bpostInput = wrapper.findChoice('carrier__input', BPOST);
    bpostInput.element.click();
    await waitForEvent(UPDATED_DELIVERY_OPTIONS);
    expect(bpost.find('[data-test-id="deliveryDate__select__label"]').element).not.toBeVisible();

    const dpd = wrapper.findChoice('carrier', DPD);
    const dpdInput = wrapper.findChoice('carrier__input', DPD);
    dpdInput.element.click();
    await waitForEvent(UPDATED_DELIVERY_OPTIONS);
    expect(dpd.find('[data-test-id="deliveryDate__select__label"]').element).toBeVisible();
  });

  test.each`
    platform        | carrier            | weekday      | expected
    ${MYPARCEL}     | ${POSTNL}          | ${MONDAY}    | ${false}
    ${MYPARCEL}     | ${POSTNL}          | ${TUESDAY}   | ${false}
    ${MYPARCEL}     | ${POSTNL}          | ${WEDNESDAY} | ${false}
    ${MYPARCEL}     | ${POSTNL}          | ${THURSDAY}  | ${false}
    ${MYPARCEL}     | ${POSTNL}          | ${FRIDAY}    | ${false}
    ${MYPARCEL}     | ${POSTNL}          | ${SATURDAY}  | ${true}
    ${MYPARCEL}     | ${POSTNL}          | ${SUNDAY}    | ${false}
    ${MYPARCEL}     | ${RED_JE_PAKKETJE} | ${SATURDAY}  | ${false}
    ${SENDMYPARCEL} | ${BPOST}           | ${MONDAY}    | ${false}
    ${SENDMYPARCEL} | ${BPOST}           | ${TUESDAY}   | ${false}
    ${SENDMYPARCEL} | ${BPOST}           | ${WEDNESDAY} | ${false}
    ${SENDMYPARCEL} | ${BPOST}           | ${THURSDAY}  | ${false}
    ${SENDMYPARCEL} | ${BPOST}           | ${FRIDAY}    | ${true}
    ${SENDMYPARCEL} | ${BPOST}           | ${SATURDAY}  | ${false}
    ${SENDMYPARCEL} | ${BPOST}           | ${SUNDAY}    | ${false}
    ${SENDMYPARCEL} | ${DPD}             | ${FRIDAY}    | ${false}
    ${SENDMYPARCEL} | ${POSTNL}          | ${FRIDAY}    | ${false}
  `('handles extra dropoff day for $platform, $carrier on day $weekday correctly', ({
    platform,
    carrier,
    weekday,
    expected,
  }) => {
    const date = dayjs().weekday(weekday).set('h', 10).set('m', 0).toDate();
    MockDate.set(date);

    const configBus = mockConfigBus({
      [CONFIG.KEY]: {
        [CONFIG.PLATFORM]: platform,
        [CONFIG.DROP_OFF_DAYS]: [0, 1, 2, 3, 4, 5, 6],
        [CONFIG.CARRIER_SETTINGS]: {
          [carrier]: {
            [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
            [CONFIG.ALLOW_MONDAY_DELIVERY]: true,
            [CONFIG.ALLOW_SATURDAY_DELIVERY]: true,
          },
        },
      },
    });

    const extraDropOffDay = getExtraDropOffDay(configBus);
    const todayIsExtraDropOffDay = extraDropOffDay && checkIsDropOffDay(extraDropOffDay.dropOffDay, configBus);
    expect(todayIsExtraDropOffDay)[expected ? 'toBeTruthy' : 'toBeFalsy']();
  });
});
