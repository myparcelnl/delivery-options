import {afterEach, describe, expect, it, vi} from 'vitest';
import {createDate, waitForEvent} from '@myparcel-do/shared/testing';
import {
  ALLOW_DELIVERY_OPTIONS,
  ALLOW_EVENING_DELIVERY,
  ALLOW_MORNING_DELIVERY,
  ALLOW_SAME_DAY_DELIVERY,
  CARRIER_SETTINGS,
  DAY_TUESDAY,
  DROP_OFF_DAYS,
  FEATURE_SHOW_DELIVERY_DATE,
  type InputDeliveryOptionsConfig,
  KEY_CONFIG,
  PLATFORM,
  UPDATED_DELIVERY_OPTIONS,
} from '@myparcel-do/shared';
import {CarrierName, DeliveryTypeName, PlatformName} from '@myparcel/constants';
import {mockDeliveryOptionsConfig} from '../../utils';

describe.skip('Delivery moments', () => {
  afterEach(() => {
    vi.setSystemTime(vi.getRealSystemTime());
  });

  async function getDeliveryMoments(date: Date, config: Partial<InputDeliveryOptionsConfig>) {
    vi.setSystemTime(date);

    mockDeliveryOptionsConfig({
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
      const date = createDate(DAY_TUESDAY, 10, 0);

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
        ...(allowMorning ? [DeliveryTypeName.Morning] : []),
        DeliveryTypeName.Standard,
        ...(allowEvening ? [DeliveryTypeName.Evening] : []),
      ]);
    },
  );

  it('does not return morning and evening delivery options when delivery date is not shown', async () => {
    expect.assertions(1);
    const date = createDate(DAY_TUESDAY, 10, 0);

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
    expect(deliveryMoments).toEqual([DeliveryTypeName.Standard]);
  });

  it('returns same day delivery if same day is enabled and current time is before same day cut-off time', async () => {
    expect.assertions(1);
    const date = createDate(DAY_TUESDAY, 6, 0);
    const deliveryMoments = await getDeliveryMoments(date, sameDayConfig);

    expect(deliveryMoments).toEqual([DELIVERY_SAME_DAY]);
  });

  it('returns standard delivery if same day is enabled and current time is before regular cut-off time', async () => {
    expect.assertions(1);
    // Before cut-off time (which defaults to 17:00)
    const date = createDate(DAY_TUESDAY, 15, 0);
    const deliveryMoments = await getDeliveryMoments(date, sameDayConfig);

    expect(deliveryMoments).toEqual([DeliveryTypeName.Standard]);
  });
});
