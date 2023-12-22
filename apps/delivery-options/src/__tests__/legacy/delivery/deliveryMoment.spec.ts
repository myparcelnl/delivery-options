import {afterEach, describe, expect, it, vi} from 'vitest';
import {createDate, waitForEvent} from '@myparcel-do/shared/testing';
import {
  CarrierSetting,
  ConfigSetting,
  DAY_TUESDAY,
  type InputDeliveryOptionsConfig,
  KEY_CARRIER_SETTINGS,
  KEY_CONFIG,
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
        [ConfigSetting.Platform]: PlatformName.MyParcel,
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
    [KEY_CARRIER_SETTINGS]: {
      [CarrierName.DhlForYou]: {
        [CarrierSetting.AllowDeliveryOptions]: true,
        [CarrierSetting.AllowSameDayDelivery]: true,
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
        [CarrierSetting.DropOffDays]: [0, 1, 2, 3, 4, 5, 6],
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
            [CarrierSetting.AllowDeliveryOptions]: true,
            [CarrierSetting.AllowMorningDelivery]: allowMorning,
            [CarrierSetting.AllowEveningDelivery]: allowEvening,
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
      [CarrierSetting.DropOffDays]: [0, 1, 2, 3, 4, 5, 6],
      [KEY_CARRIER_SETTINGS]: {
        [CarrierName.PostNl]: {
          [CarrierSetting.AllowDeliveryOptions]: true,
          [CarrierSetting.AllowMorningDelivery]: true,
          [CarrierSetting.AllowEveningDelivery]: true,
          [ConfigSetting.ShowDeliveryDate]: false,
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
