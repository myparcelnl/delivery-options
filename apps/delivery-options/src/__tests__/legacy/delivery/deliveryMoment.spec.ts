import {afterEach, describe, expect, it} from 'vitest';
import dayjs from 'dayjs';
import {
  CONFIG,
  DELIVERY_EVENING,
  DELIVERY_MORNING,
  DELIVERY_SAME_DAY,
  DELIVERY_STANDARD,
  DHL_FOR_YOU,
  KEY_CONFIG,
  MYPARCEL,
  POSTNL,
  TUESDAY,
  UPDATED_DELIVERY_OPTIONS,
} from '@myparcel-do/shared';
import {mockDeliveryOptions} from '../mockDeliveryOptions';

/**
 * @param {dayjs.Dayjs} date
 * @param {Partial<MyParcelDeliveryOptions.Config>} config
 * @returns {Promise<Object[]>}
 */
async function getDeliveryMoments(date, config) {
  MockDate.set(date.toDate());

  const wrapper = mockDeliveryOptions({
    [KEY_CONFIG]: {
      [CONFIG.PLATFORM]: MYPARCEL,
      ...config,
    },
  });
  await waitForEvent(UPDATED_DELIVERY_OPTIONS);

  const deliveryMomentsWrappers = wrapper.findAll('[data-test-id="deliveryMoment"]');
  return deliveryMomentsWrappers.wrappers.map((wrapper) => {
    return wrapper.element.getAttribute('data-test-choice');
  });
}

const sameDayConfig = {
  [CONFIG.CARRIER_SETTINGS]: {
    [DHL_FOR_YOU]: {
      [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
      [CONFIG.ALLOW_SAME_DAY_DELIVERY]: true,
    },
  },
};

describe('Delivery moments', () => {
  afterEach(() => {
    MockDate.reset();
  });

  it.each`
    allowMorning | allowEvening
    ${true}      | ${true}
    ${false}     | ${false}
    ${true}      | ${false}
    ${false}     | ${true}
  `(
    'shows delivery moments in the right order with morning "$allowMorning" and evening "$allowEvening"',
    async ({allowMorning, allowEvening}) => {
      expect.assertions(1);
      const date = dayjs().weekday(TUESDAY).set('h', 10).set('m', 0);
      const deliveryMoments = await getDeliveryMoments(date, {
        [CONFIG.DROP_OFF_DAYS]: [0, 1, 2, 3, 4, 5, 6],
        [CONFIG.CARRIER_SETTINGS]: {
          [POSTNL]: {
            [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
            [CONFIG.ALLOW_MORNING_DELIVERY]: allowMorning,
            [CONFIG.ALLOW_EVENING_DELIVERY]: allowEvening,
          },
        },
      });

      expect(deliveryMoments).toEqual([
        ...(allowMorning ? [DELIVERY_MORNING] : []),
        DELIVERY_STANDARD,
        ...(allowEvening ? [DELIVERY_EVENING] : []),
      ]);
    },
  );

  it('does not return morning and evening delivery options when delivery date is not shown', async () => {
    expect.assertions(1);
    const date = dayjs().weekday(TUESDAY).set('h', 10).set('m', 0);
    const deliveryMoments = await getDeliveryMoments(date, {
      [CONFIG.DROP_OFF_DAYS]: [0, 1, 2, 3, 4, 5, 6],
      [CONFIG.CARRIER_SETTINGS]: {
        [POSTNL]: {
          [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
          [CONFIG.ALLOW_MORNING_DELIVERY]: true,
          [CONFIG.ALLOW_EVENING_DELIVERY]: true,
          [CONFIG.FEATURE_SHOW_DELIVERY_DATE]: false,
        },
      },
    });
    expect(deliveryMoments).toEqual([DELIVERY_STANDARD]);
  });

  it('returns same day delivery if same day is enabled and current time is before same day cut-off time', async () => {
    expect.assertions(1);
    // Before same day cut-off time (which defaults to 9:30)
    const date = dayjs().weekday(TUESDAY).set('h', 6).set('m', 0);
    const deliveryMoments = await getDeliveryMoments(date, sameDayConfig);

    expect(deliveryMoments).toEqual([DELIVERY_SAME_DAY]);
  });

  it('returns standard delivery if same day is enabled and current time is before regular cut-off time', async () => {
    expect.assertions(1);
    // Before cut-off time (which defaults to 17:00)
    const date = dayjs().weekday(TUESDAY).set('h', 15).set('m', 0);
    const deliveryMoments = await getDeliveryMoments(date, sameDayConfig);

    expect(deliveryMoments).toEqual([DELIVERY_STANDARD]);
  });
});
