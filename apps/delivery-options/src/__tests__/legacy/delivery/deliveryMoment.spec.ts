import {afterEach, describe, expect, it, vi} from 'vitest';
import dayjs from 'dayjs';
import {
  ALLOW_DELIVERY_OPTIONS,
  ALLOW_EVENING_DELIVERY,
  ALLOW_MORNING_DELIVERY,
  ALLOW_SAME_DAY_DELIVERY,
  CARRIER_SETTINGS,
  DELIVERY_EVENING,
  DELIVERY_MORNING,
  DELIVERY_SAME_DAY,
  DELIVERY_STANDARD,
  DROP_OFF_DAYS,
  FEATURE_SHOW_DELIVERY_DATE,
  KEY_CONFIG,
  PLATFORM,
  TUESDAY,
  UPDATED_DELIVERY_OPTIONS,
} from '@myparcel-do/shared';
import {CarrierName, PlatformName} from '@myparcel/constants';
import {mockDeliveryOptions} from '../mockDeliveryOptions';

describe.skip('Delivery moments', () => {
  /**
   * @param {dayjs.Dayjs} date
   * @param {Partial<MyParcelDeliveryOptions.Config>} config
   * @returns {Promise<Object[]>}
   */
  async function getDeliveryMoments(date, config) {
    vi.setSystemTime(date.toDate());

    const wrapper = mockDeliveryOptions({
      [KEY_CONFIG]: {
        [PLATFORM]: PlatformName.MyParcel,
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
    [CARRIER_SETTINGS]: {
      [CarrierName.DhlForYou]: {
        [ALLOW_DELIVERY_OPTIONS]: true,
        [ALLOW_SAME_DAY_DELIVERY]: true,
      },
    },
  };

  afterEach(() => {
    vi.setSystemTime(vi.getRealSystemTime());
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
        [DROP_OFF_DAYS]: [0, 1, 2, 3, 4, 5, 6],
        [CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
            [ALLOW_DELIVERY_OPTIONS]: true,
            [ALLOW_MORNING_DELIVERY]: allowMorning,
            [ALLOW_EVENING_DELIVERY]: allowEvening,
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
      [DROP_OFF_DAYS]: [0, 1, 2, 3, 4, 5, 6],
      [CARRIER_SETTINGS]: {
        [CarrierName.PostNl]: {
          [ALLOW_DELIVERY_OPTIONS]: true,
          [ALLOW_MORNING_DELIVERY]: true,
          [ALLOW_EVENING_DELIVERY]: true,
          [FEATURE_SHOW_DELIVERY_DATE]: false,
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
