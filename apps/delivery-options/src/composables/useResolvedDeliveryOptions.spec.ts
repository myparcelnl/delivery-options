import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {assign} from 'radash';
import {normalizeDate} from '@vueuse/core';
import {mockGetDeliveryOptions} from '@myparcel-dev/shared/testing';
import {
  KEY_CONFIG,
  CarrierSetting,
  KEY_CARRIER_SETTINGS,
  createTimestamp,
  type InputDeliveryOptionsConfiguration,
  KEY_ADDRESS,
  ConfigSetting,
} from '@myparcel-dev/shared';
import {type RecursivePartial} from '@myparcel-dev/ts-utils';
import {DeliveryTypeName, CarrierName} from '@myparcel-dev/constants';
import {useConfigStore} from '../stores';
import {DELIVERY_MOMENT_PACKAGE_TYPES} from '../data';
import {
  waitForDeliveryOptions,
  mockDeliveryOptionsConfig,
  getMockDeliveryOptionsConfiguration,
  createDeliveryPossibility,
} from '../__tests__';
import {useResolvedDeliveryOptions} from './useResolvedDeliveryOptions';

const CARRIER_IDENTIFIER_WITH_CONTRACT = `${CarrierName.PostNl}:1234`;

const setupPostNl = async (config: RecursivePartial<InputDeliveryOptionsConfiguration> = {}): Promise<void> => {
  const morning = normalizeDate('2022-01-01T09:00:00Z');
  const standard = normalizeDate('2022-01-01T15:00:00Z');
  const evening = normalizeDate('2022-01-01T20:00:00Z');

  mockGetDeliveryOptions.mockReturnValue(
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

  const carrierSettings = {
    [CarrierSetting.AllowDeliveryOptions]: true,
    [CarrierSetting.AllowEveningDelivery]: true,
    [CarrierSetting.AllowMorningDelivery]: true,
    [CarrierSetting.AllowStandardDelivery]: true,
  };

  mockDeliveryOptionsConfig(
    getMockDeliveryOptionsConfiguration(
      assign(
        {
          [KEY_CONFIG]: {
            [KEY_CARRIER_SETTINGS]: {
              [CarrierName.PostNl]: carrierSettings,
              [CARRIER_IDENTIFIER_WITH_CONTRACT]: carrierSettings,
            },
          },
        },
        config,
      ),
    ),
  );
  await waitForDeliveryOptions();
};

describe('useResolvedDeliveryOptions', () => {
  beforeEach(() => {
    useResolvedDeliveryOptions.clear();
    useConfigStore().reset();
  });

  it('sorts options by time', async () => {
    await setupPostNl();

    const options = useResolvedDeliveryOptions();

    const resolvedOptions = options.value.map(({carrier, deliveryType}) => ({carrier, deliveryType}));

    expect(resolvedOptions).toEqual([
      {carrier: CarrierName.PostNl, deliveryType: DeliveryTypeName.Morning},
      {carrier: CarrierName.PostNl, deliveryType: DeliveryTypeName.Standard},
      {carrier: CarrierName.PostNl, deliveryType: DeliveryTypeName.Evening},
      {carrier: CARRIER_IDENTIFIER_WITH_CONTRACT, deliveryType: DeliveryTypeName.Morning},
      {carrier: CARRIER_IDENTIFIER_WITH_CONTRACT, deliveryType: DeliveryTypeName.Standard},
      {carrier: CARRIER_IDENTIFIER_WITH_CONTRACT, deliveryType: DeliveryTypeName.Evening},
    ]);
  });

  it('handles fake delivery', async () => {
    // DE is not a delivery country for PostNL.
    await setupPostNl({[KEY_ADDRESS]: {cc: 'DE'}});

    const options = useResolvedDeliveryOptions();
    const resolvedOptions = options.value.map(({carrier, deliveryType, packageType}) => ({
      carrier,
      deliveryType,
      packageType,
    }));

    const expected: any[] = [];
    DELIVERY_MOMENT_PACKAGE_TYPES.forEach((packageType) => {
      expected.push({carrier: CarrierName.PostNl, deliveryType: DeliveryTypeName.Standard, packageType});
      expected.push({
        carrier: CARRIER_IDENTIFIER_WITH_CONTRACT,
        deliveryType: DeliveryTypeName.Standard,
        packageType,
      });
    });
    // Sort expected by carrier name
    // eslint-disable-next-line id-length
    expected.sort((a, b) => a.carrier.localeCompare(b.carrier));
    expect(resolvedOptions).toEqual(expected);
  });

  it('returns an empty array if all delivery options requests fail', () => {
    // Set up config for PostNL (or any carrier)
    const carrierSettings = {
      [CarrierSetting.AllowDeliveryOptions]: true,
      [CarrierSetting.AllowStandardDelivery]: true,
    };
    mockDeliveryOptionsConfig(
      getMockDeliveryOptionsConfiguration({
        [KEY_CONFIG]: {
          [KEY_CARRIER_SETTINGS]: {
            [CarrierName.PostNl]: carrierSettings,
          },
        },
      }),
    );
    useResolvedDeliveryOptions.clear();
    useConfigStore().reset();

    // Simulate all requests failing
    mockGetDeliveryOptions.mockImplementation(() => Promise.reject(new Error('Test error')));

    const options = useResolvedDeliveryOptions();
    expect(options.value).toEqual([]);
  });

  describe('Closed Days Filtering', () => {
    const isDateMatch = (dateString: string | undefined, year: number, month: number, day: number): boolean => {
      if (!dateString) return false;

      const dateObj = new Date(dateString);
      return dateObj.getUTCFullYear() === year && dateObj.getUTCMonth() === month - 1 && dateObj.getUTCDate() === day;
    };

    const createDeliveryOptionsForDateRange = () => {
      const deliveryOptions = [];
      for (let i = 1; i <= 14; i++) {
        const year = 2025;
        const month = 0;
        const day = i;
        const date = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        deliveryOptions.push({
          date: createTimestamp(date.toISOString()),
          possibilities: [createDeliveryPossibility(normalizeDate(`${dateString}T15:00:00`))],
        });
      }

      return deliveryOptions;
    };

    const testClosedDaysFiltering = async (
      closedDays: string[],
      dropOffDelay = 0,
      cutoffTime = '16:00',
      orderDate = '2025-01-01T10:00:00',
    ) => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(orderDate));

      const deliveryOptions = createDeliveryOptionsForDateRange();
      mockGetDeliveryOptions.mockImplementation(() => Promise.resolve(deliveryOptions));

      const carrierSettings = {
        [CarrierSetting.AllowDeliveryOptions]: true,
        [CarrierSetting.AllowStandardDelivery]: true,
        [CarrierSetting.DropOffDelay]: dropOffDelay,
        [CarrierSetting.CutoffTime]: cutoffTime,
      };

      mockDeliveryOptionsConfig(
        getMockDeliveryOptionsConfiguration({
          [KEY_CONFIG]: {
            [KEY_CARRIER_SETTINGS]: {
              [CarrierName.PostNl]: carrierSettings,
            },
            [ConfigSetting.ClosedDays]: closedDays,
          },
        }),
      );

      const options = useResolvedDeliveryOptions();
      await waitForDeliveryOptions();

      return options.value.map((option) => option.date).filter(Boolean);
    };

    afterEach(() => {
      vi.clearAllMocks();
      vi.useRealTimers();
    });

    it('First closed day in sequence is only unavailable if insufficient processing time', async () => {
      const availableDates = await testClosedDaysFiltering(['2025-01-02'], 1, '16:00', '2025-01-01T10:00:00Z');

      expect(availableDates.some((date) => isDateMatch(date, 2025, 1, 2))).toBe(false);
    });

    it('All subsequent consecutive closed days are always unavailable', async () => {
      const availableDates = await testClosedDaysFiltering(['2025-01-02', '2025-01-03', '2025-01-04'], 0);

      expect(availableDates.some((date) => isDateMatch(date, 2025, 1, 2))).toBe(true);
      expect(availableDates.some((date) => isDateMatch(date, 2025, 1, 3))).toBe(false);
      expect(availableDates.some((date) => isDateMatch(date, 2025, 1, 4))).toBe(false);
    });

    it('Day after closed day sequence is always unavailable', async () => {
      const availableDates = await testClosedDaysFiltering(['2025-01-02'], 0);

      expect(availableDates.some((date) => isDateMatch(date, 2025, 1, 2))).toBe(true);
      expect(availableDates.some((date) => isDateMatch(date, 2025, 1, 3))).toBe(false);
    });

    it('Additional days after sequences are filtered based on dropOffDelay', async () => {
      const availableDates = await testClosedDaysFiltering(['2025-01-02'], 2);

      expect(availableDates.some((date) => isDateMatch(date, 2025, 1, 2))).toBe(true);
      expect(availableDates.some((date) => isDateMatch(date, 2025, 1, 3))).toBe(false);
      expect(availableDates.some((date) => isDateMatch(date, 2025, 1, 4))).toBe(false);
      expect(availableDates.some((date) => isDateMatch(date, 2025, 1, 5))).toBe(false);
      expect(availableDates.some((date) => isDateMatch(date, 2025, 1, 6))).toBe(true);
    });

    it('Cutoff time affects whether orders are processed same-day or next-day', async () => {
      const availableDates = await testClosedDaysFiltering(['2025-01-02'], 1, '16:00', '2025-01-01T15:00:00Z');

      expect(availableDates.some((date) => isDateMatch(date, 2025, 1, 2))).toBe(false);
    });
  });
});
