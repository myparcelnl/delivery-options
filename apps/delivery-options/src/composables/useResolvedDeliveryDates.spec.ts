import {describe, it, expect, beforeEach, afterEach} from 'vitest';
import {addDays} from 'date-fns';
import {mockGetDeliveryOptions, createDate} from '@myparcel-dev/do-shared/testing';
import {
  KEY_CONFIG,
  type InputDeliveryOptionsConfiguration,
  KEY_CARRIER_SETTINGS,
  CarrierSetting,
  createTimestamp,
} from '@myparcel-dev/do-shared';
import {CarrierName} from '@myparcel-dev/constants';
import {useConfigStore} from '../stores';
import {mockDeliveryOptionsConfig, waitForDeliveryOptions, getMockDeliveryOptionsConfiguration} from '../__tests__';
import {useResolvedDeliveryDates} from './useResolvedDeliveryDates';

const SHARED_CONFIG = getMockDeliveryOptionsConfiguration({
  [KEY_CONFIG]: {
    [KEY_CARRIER_SETTINGS]: {
      [CarrierName.PostNl]: {
        [CarrierSetting.AllowDeliveryOptions]: true,
        [CarrierSetting.AllowStandardDelivery]: true,
      },
      [CarrierName.DhlForYou]: {
        [CarrierSetting.AllowDeliveryOptions]: true,
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

  it('returns an empty array if deliveryDaysWindow is 1 or less for all carriers', () => {
    mockDeliveryOptionsConfig({
      ...SHARED_CONFIG,
      [KEY_CONFIG]: {
        ...SHARED_CONFIG[KEY_CONFIG],
        [CarrierSetting.DeliveryDaysWindow]: 1,
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
            [CarrierSetting.AllowDeliveryOptions]: true,
            [CarrierSetting.AllowStandardDelivery]: true,
          },
          [CarrierName.DhlForYou]: {
            [CarrierSetting.AllowDeliveryOptions]: true,
            [CarrierSetting.AllowStandardDelivery]: true,
            [CarrierSetting.AllowSameDayDelivery]: true,
          },
        },
      },
    });

    const dates = useResolvedDeliveryDates();

    expect(dates.value).toEqual([]);
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
