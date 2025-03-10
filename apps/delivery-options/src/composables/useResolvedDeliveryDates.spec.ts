import {describe, it, expect, beforeEach, afterEach} from 'vitest';
import {addDays} from 'date-fns';
import {mockGetDeliveryOptions, createDate} from '@myparcel-do/shared/testing';
import {
  ConfigSetting,
  KEY_CONFIG,
  type InputDeliveryOptionsConfiguration,
  KEY_CARRIER_SETTINGS,
  CarrierSetting,
  createTimestamp,
} from '@myparcel-do/shared';
import {CarrierName} from '@myparcel/constants';
import {useAddressStore, useConfigStore} from '../stores';
import {mockDeliveryOptionsConfig, waitForDeliveryOptions, getMockDeliveryOptionsConfiguration} from '../__tests__';
import {useResolvedDeliveryDates} from './useResolvedDeliveryDates';

const SHARED_CONFIG = getMockDeliveryOptionsConfiguration({
  [KEY_CONFIG]: {
    [ConfigSetting.ShowDeliveryDate]: true,
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

  it('returns an empty array if showDeliveryDate is false', () => {
    mockDeliveryOptionsConfig({
      ...SHARED_CONFIG,
      [KEY_CONFIG]: {
        ...SHARED_CONFIG[KEY_CONFIG],
        [ConfigSetting.ShowDeliveryDate]: false,
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
