import {describe, it, expect, beforeEach} from 'vitest';
import {setActivePinia, createPinia} from 'pinia';
import {normalizeDate} from '@vueuse/core';
import {mockGetDeliveryOptions} from '@myparcel-do/shared/testing';
import {KEY_CONFIG, CarrierSetting, KEY_CARRIER_SETTINGS, createTimestamp} from '@myparcel-do/shared';
import {DeliveryTypeName, CarrierName} from '@myparcel/constants';
import {
  waitForDeliveryOptions,
  mockDeliveryOptionsConfig,
  getMockDeliveryOptionsConfiguration,
  createDeliveryPossibility,
} from '../__tests__';
import {useResolvedDeliveryOptions} from './useResolvedDeliveryOptions';

const mockSetup = async (): Promise<void> => {
  mockDeliveryOptionsConfig(
    getMockDeliveryOptionsConfiguration({
      [KEY_CONFIG]: {
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
            [CarrierSetting.AllowDeliveryOptions]: true,
            [CarrierSetting.AllowMondayDelivery]: true,
            [CarrierSetting.AllowSameDayDelivery]: true,
            [CarrierSetting.AllowEveningDelivery]: true,
            [CarrierSetting.AllowMorningDelivery]: true,
            [CarrierSetting.AllowStandardDelivery]: true,
          },
        },
      },
    }),
  );

  await waitForDeliveryOptions();
};

describe('useResolvedDeliveryOptions', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('sorts options by time', async () => {
    const morning = normalizeDate('2022-01-01T09:00:00');
    const standard = normalizeDate('2022-01-01T15:00:00');
    const evening = normalizeDate('2022-01-01T20:00:00');

    mockGetDeliveryOptions.mockReturnValueOnce(
      Promise.resolve([
        {
          date: createTimestamp(standard),
          possibilities: [
            createDeliveryPossibility(evening, {type: DeliveryTypeName.Evening}),
            createDeliveryPossibility(standard),
            createDeliveryPossibility(morning, {type: DeliveryTypeName.Morning}),
          ],
        },
      ]),
    );

    await mockSetup();

    const options = useResolvedDeliveryOptions();

    expect(options.value.map((option) => option.deliveryType)).toEqual([
      DeliveryTypeName.Morning,
      DeliveryTypeName.Standard,
      DeliveryTypeName.Evening,
    ]);
  });
});
