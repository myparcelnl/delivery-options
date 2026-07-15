import {describe, it, expect, beforeEach, afterEach} from 'vitest';
import {addDays} from 'date-fns';
import {normalizeDate} from '@vueuse/core';
import {flushPromises} from '@vue/test-utils';
import {mockGetDeliveryOptions, createDate} from '@myparcel-dev/do-shared/testing';
import {
  KEY_CONFIG,
  type InputDeliveryOptionsConfiguration,
  KEY_CARRIER_SETTINGS,
  CarrierSetting,
  createTimestamp,
} from '@myparcel-dev/do-shared';
import {CarrierName, PackageTypeName} from '@myparcel-dev/constants';
import {useConfigStore} from '../stores';
import {
  mockDeliveryOptionsConfig,
  waitForDeliveryOptions,
  getMockDeliveryOptionsConfiguration,
  createDeliveryPossibility,
  mockSelectedDeliveryOptions,
} from '../__tests__';
import {useResolvedDeliveryDates} from './useResolvedDeliveryDates';
import {useFeatures} from './useFeatures';

const MOCK_DATE = '2025-01-15';

const SHARED_CONFIG = getMockDeliveryOptionsConfiguration({
  [KEY_CONFIG]: {
    [KEY_CARRIER_SETTINGS]: {
      [CarrierName.PostNl]: {
        [CarrierSetting.AllowStandardDelivery]: true,
      },
      [CarrierName.DhlForYou]: {
        [CarrierSetting.AllowStandardDelivery]: true,
        [CarrierSetting.AllowSameDayDelivery]: true,
      },
    },
  },
} satisfies Partial<InputDeliveryOptionsConfiguration>);

describe('useResolvedDeliveryDates', () => {
  beforeEach(() => {
    useConfigStore().reset();
  });

  afterEach(() => {
    useResolvedDeliveryDates.clear();
  });

  it('returns an empty array when deliveryDaysWindow is 0 for all carriers', () => {
    mockDeliveryOptionsConfig({
      ...SHARED_CONFIG,
      [KEY_CONFIG]: {
        ...SHARED_CONFIG[KEY_CONFIG],
        [CarrierSetting.DeliveryDaysWindow]: 0,
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
            [CarrierSetting.AllowStandardDelivery]: true,
          },
          [CarrierName.DhlForYou]: {
            [CarrierSetting.AllowStandardDelivery]: true,
            [CarrierSetting.AllowSameDayDelivery]: true,
          },
        },
      },
    });

    const dates = useResolvedDeliveryDates();

    expect(dates.value).toEqual([]);
  });

  // Regression test for INT-1552: https://myparcel.atlassian.net/browse/INT-1552
  // Ensures that a window of 1 still shows the first next delivery date. (Match API behavior)
  it('shows the next delivery date when deliveryDaysWindow=1 (INT-1552)', async () => {
    mockGetDeliveryOptions.mockImplementation(() =>
      Promise.resolve([
        {
          date: createTimestamp(`${MOCK_DATE} 00:00:00`),
          possibilities: [
            createDeliveryPossibility(normalizeDate(`${MOCK_DATE}T15:00:00`), {
              package_type: PackageTypeName.Package,
              shipment_options: [],
            }),
          ],
        },
      ]),
    );

    mockDeliveryOptionsConfig(
      getMockDeliveryOptionsConfiguration({
        [KEY_CONFIG]: {
          [CarrierSetting.PackageType]: PackageTypeName.Package,
          [CarrierSetting.DeliveryDaysWindow]: 1,
          [KEY_CARRIER_SETTINGS]: {
            [CarrierName.PostNl]: {
              [CarrierSetting.AllowStandardDelivery]: true,
            },
          },
        },
      }),
    );
    mockSelectedDeliveryOptions();

    const dates = useResolvedDeliveryDates();
    const {showDeliveryDate} = useFeatures();
    await waitForDeliveryOptions();
    await flushPromises();

    expect(showDeliveryDate.value).toBe(true);
    expect(dates.value.length).toBeGreaterThanOrEqual(1);
  });

  it.skip('sorts items by date', async () => {
    expect.assertions(1);
    mockDeliveryOptionsConfig(SHARED_CONFIG);

    mockGetDeliveryOptions.mockReturnValueOnce(
      Promise.resolve([
        {
          date: createTimestamp(addDays(createDate(), 1)),
          possibilities: [],
        },
        {
          date: createTimestamp(addDays(createDate(), 2)),
          possibilities: [],
        },
      ]),
    );

    mockGetDeliveryOptions.mockReturnValueOnce(
      Promise.resolve([
        {
          date: createTimestamp(createDate()),
          possibilities: [],
        },
      ]),
    );

    await waitForDeliveryOptions(CarrierName.PostNl);
    await waitForDeliveryOptions(CarrierName.DhlForYou);

    const dates = useResolvedDeliveryDates();

    expect(dates.value.map((item) => item.date)).toEqual([]);
  });
});
