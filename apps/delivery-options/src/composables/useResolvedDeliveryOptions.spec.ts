import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {assign} from 'radash';
import {normalizeDate} from '@vueuse/core';
import {mockGetDeliveryOptions} from '@myparcel-do/shared/testing';
import {
  KEY_CONFIG,
  CarrierSetting,
  KEY_CARRIER_SETTINGS,
  createTimestamp,
  type InputDeliveryOptionsConfiguration,
  KEY_ADDRESS,
  ConfigSetting,
} from '@myparcel-do/shared';
import {type RecursivePartial} from '@myparcel/ts-utils';
import {DeliveryTypeName, CarrierName} from '@myparcel/constants';
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
  const morning = normalizeDate('2022-01-01T09:00:00');
  const standard = normalizeDate('2022-01-01T15:00:00');
  const evening = normalizeDate('2022-01-01T20:00:00');

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
    // Helper function to create delivery options for dates 01/01/2025 to 14/01/2025
    const createDeliveryOptionsForDateRange = () => {
      const deliveryOptions = [];
      for (let i = 1; i <= 14; i++) {
        const date = new Date('2025-01-01');
        date.setDate(date.getDate() + i - 1); // i-1 because we want 01/01 to 14/01
        deliveryOptions.push({
          date: createTimestamp(date.toISOString()),
          possibilities: [createDeliveryPossibility(normalizeDate(`${date.toISOString().split('T')[0]}T15:00:00`))],
        });
      }

      return deliveryOptions;
    };

    // Helper function to test closed days filtering with the actual composable
    const testClosedDaysFiltering = async (
      closedDays: string[],
      dropOffDelay = 0,
      cutoffTime = '16:00',
      orderDate = '2025-01-01T10:00:00',
    ) => {
      // Set up fake timers
      vi.useFakeTimers();
      vi.setSystemTime(new Date(orderDate));

      // Create delivery options for the date range
      const deliveryOptions = createDeliveryOptionsForDateRange();

      // Mock the delivery options response using mockImplementation to override the default behavior
      mockGetDeliveryOptions.mockImplementation(() => Promise.resolve(deliveryOptions));

      // Set up configuration
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

      // Get the filtered results from the actual composable
      const options = useResolvedDeliveryOptions();
      await waitForDeliveryOptions();

      return options.value.map((option) => option.date).filter(Boolean);
    };

    afterEach(() => {
      vi.clearAllMocks();
      vi.useRealTimers();
    });

    it('First closed day in sequence is only unavailable if insufficient processing time', async () => {
      // Order on 2025-01-01, closed day on 2025-01-02 (next day), dropOffDelay 1
      // Need 2 days processing time, but only 1 day available - should be filtered
      const availableDates = await testClosedDaysFiltering(
        ['2025-01-02'], // Closed day
        1, // DropOffDelay
        '16:00',
        '2025-01-01T10:00:00', // Order date
      );

      // 2025-01-02 should be filtered out (insufficient processing time)
      expect(availableDates.some((date) => date && date.includes('2025-01-02'))).toBe(false);
    });

    it('All subsequent consecutive closed days are always unavailable', async () => {
      // Order on 2025-01-01, closed days on 2025-01-02, 2025-01-03, 2025-01-04 (consecutive)
      // First day should follow processing rules, others always unavailable
      const availableDates = await testClosedDaysFiltering(
        ['2025-01-02', '2025-01-03', '2025-01-04'], // Consecutive closed days
        0, // No dropOffDelay
      );

      // 2025-01-02 should be available (first day, sufficient processing time)
      expect(availableDates.some((date) => date && date.includes('2025-01-02'))).toBe(true);
      // 2025-01-03 and 2025-01-04 should be filtered out (subsequent days)
      expect(availableDates.some((date) => date && date.includes('2025-01-03'))).toBe(false);
      expect(availableDates.some((date) => date && date.includes('2025-01-04'))).toBe(false);
    });

    it('Day after closed day sequence is always unavailable', async () => {
      // Order on 2025-01-01, closed day on 2025-01-02, day after (2025-01-03) should be filtered
      const availableDates = await testClosedDaysFiltering(
        ['2025-01-02'], // Single closed day
        0, // No dropOffDelay
      );

      // 2025-01-02 should be available (sufficient processing time)
      expect(availableDates.some((date) => date && date.includes('2025-01-02'))).toBe(true);
      // 2025-01-03 should be filtered out (day after closed day)
      expect(availableDates.some((date) => date && date.includes('2025-01-03'))).toBe(false);
    });

    it('Additional days after sequences are filtered based on dropOffDelay', async () => {
      // Order on 2025-01-01, closed day on 2025-01-02, dropOffDelay 2
      // Should filter: 2025-01-03 (day after) + 2 additional days = 2025-01-03, 2025-01-04, 2025-01-05
      const availableDates = await testClosedDaysFiltering(
        ['2025-01-02'], // Single closed day
        2, // DropOffDelay = 2
      );

      // 2025-01-02 should be available (sufficient processing time)
      expect(availableDates.some((date) => date && date.includes('2025-01-02'))).toBe(true);
      // 2025-01-03, 2025-01-04, 2025-01-05 should be filtered out (dropOffDelay = 2)
      expect(availableDates.some((date) => date && date.includes('2025-01-03'))).toBe(false);
      expect(availableDates.some((date) => date && date.includes('2025-01-04'))).toBe(false);
      expect(availableDates.some((date) => date && date.includes('2025-01-05'))).toBe(false);
      // 2025-01-06 should be available again
      expect(availableDates.some((date) => date && date.includes('2025-01-06'))).toBe(true);
    });

    it('Cutoff time affects whether orders are processed same-day or next-day', async () => {
      // Order at 15:00 (before 16:00 cutoff), closed day next day, dropOffDelay 1
      // Should be processed same day, but only 1 day available (insufficient)
      const availableDates = await testClosedDaysFiltering(
        ['2025-01-02'], // Closed day
        1, // DropOffDelay
        '16:00',
        '2025-01-01T15:00:00', // Order before cutoff (15:00 < 16:00)
      );

      // 2025-01-02 should be filtered out (insufficient processing time)
      expect(availableDates.some((date) => date && date.includes('2025-01-02'))).toBe(false);
    });
  });
});
