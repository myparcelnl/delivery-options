import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {assign} from 'radash';
import {format, isToday} from 'date-fns';
import {normalizeDate} from '@vueuse/core';
import {flushPromises} from '@vue/test-utils';
import {waitFor} from '@testing-library/vue';
import {type RecursivePartial} from '@myparcel-dev/ts-utils';
import {mockGetDeliveryOptions} from '@myparcel-dev/do-shared/testing';
import {
  KEY_CONFIG,
  CarrierSetting,
  KEY_CARRIER_SETTINGS,
  createTimestamp,
  type InputDeliveryOptionsConfiguration,
  KEY_ADDRESS,
  ConfigSetting,
  CustomDeliveryType,
} from '@myparcel-dev/do-shared';
import {DeliveryTypeName, CarrierName, PackageTypeName} from '@myparcel-dev/constants';
import {useConfigStore} from '../stores';
import {
  waitForDeliveryOptions,
  mockDeliveryOptionsConfig,
  getMockDeliveryOptionsConfiguration,
  createDeliveryPossibility,
} from '../__tests__';
import {useSelectedValues} from './useSelectedValues';
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

  it('returns an empty array for unsupported countries', async () => {
    // DE is not a supported country in capabilities, so no carriers are active.
    mockDeliveryOptionsConfig(
      getMockDeliveryOptionsConfiguration({
        [KEY_ADDRESS]: {
          cc: 'DE',
        },
        [KEY_CONFIG]: {
          [KEY_CARRIER_SETTINGS]: {
            [CarrierName.PostNl]: {
              [CarrierSetting.AllowStandardDelivery]: true,
            },
          },
        },
      }),
    );

    useResolvedDeliveryOptions.clear();
    const options = useResolvedDeliveryOptions();
    await flushPromises();

    expect(options.value).toEqual([]);
  });

  it('returns an empty array if all delivery options requests fail', () => {
    // Set up config for PostNL (or any carrier)
    const carrierSettings = {
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

  describe('clearing selected values when no dates are available', () => {
    // The dates API returns nothing for every carrier, so the resolver yields an empty result.
    // waitForDeliveryOptions() can't be used here: it waits for request data that never arrives.
    const setupEmptyResult = async (
      packageType: PackageTypeName,
      activeCarrier: CarrierName = CarrierName.PostNl,
    ): Promise<void> => {
      mockGetDeliveryOptions.mockResolvedValue([]);

      mockDeliveryOptionsConfig(
        getMockDeliveryOptionsConfiguration({
          [KEY_CONFIG]: {
            [CarrierSetting.PackageType]: packageType,
            [CarrierSetting.AllowStandardDelivery]: true,
            [KEY_CARRIER_SETTINGS]: {
              [activeCarrier]: {
                [CarrierSetting.AllowStandardDelivery]: true,
              },
            },
          },
        }),
      );

      useResolvedDeliveryOptions.clear();
      const options = useResolvedDeliveryOptions();
      void options.load();
      // waitFor flushes while polling, letting capabilities + the delivery-options pipeline settle.
      await waitFor(() => expect(options.loading.value).toBe(false), {timeout: 3000});
      await flushPromises();

      expect(options.value).toEqual([]);
    };

    it('does not clear the selection for package types whose options come from another path (mailbox)', async () => {
      const clearSpy = vi.spyOn(useSelectedValues(), 'clearSelectedValues');

      await setupEmptyResult(PackageTypeName.Mailbox);

      expect(clearSpy).not.toHaveBeenCalled();
      clearSpy.mockRestore();
    });

    it('clears the selection for delivery-moment package types when no dates are available', async () => {
      const clearSpy = vi.spyOn(useSelectedValues(), 'clearSelectedValues');

      await setupEmptyResult(PackageTypeName.Package);

      expect(clearSpy).toHaveBeenCalled();
      clearSpy.mockRestore();
    });

    it('keeps a dateless selection when no dates are available (e.g. after an address change)', async () => {
      const {deliveryMoment} = useSelectedValues();
      const datelessMoment = JSON.stringify({
        carrier: CarrierName.PostNl,
        date: null,
        deliveryType: DeliveryTypeName.Standard,
        packageType: PackageTypeName.Package,
        shipmentOptions: [],
        time: null,
      });
      deliveryMoment.value = datelessMoment;
      const clearSpy = vi.spyOn(useSelectedValues(), 'clearSelectedValues');

      await setupEmptyResult(PackageTypeName.Package);

      expect(clearSpy).not.toHaveBeenCalled();
      expect(deliveryMoment.value).toBe(datelessMoment);
      clearSpy.mockRestore();
      deliveryMoment.value = undefined;
    });

    it('clears a dateless selection when its carrier is no longer active', async () => {
      const {deliveryMoment} = useSelectedValues();
      deliveryMoment.value = JSON.stringify({
        carrier: CarrierName.PostNl,
        date: null,
        deliveryType: DeliveryTypeName.Standard,
        packageType: PackageTypeName.Package,
        shipmentOptions: [],
        time: null,
      });
      const clearSpy = vi.spyOn(useSelectedValues(), 'clearSelectedValues');

      // After the update only DHL For You is active, so the PostNL selection is stale.
      await setupEmptyResult(PackageTypeName.Package, CarrierName.DhlForYou);

      expect(clearSpy).toHaveBeenCalled();
      clearSpy.mockRestore();
      deliveryMoment.value = undefined;
    });

    it('clears the selection without throwing when the selected moment is malformed', async () => {
      const {deliveryMoment} = useSelectedValues();
      deliveryMoment.value = '{not valid json';
      const clearSpy = vi.spyOn(useSelectedValues(), 'clearSelectedValues');

      await setupEmptyResult(PackageTypeName.Package);

      expect(clearSpy).toHaveBeenCalled();
      clearSpy.mockRestore();
      deliveryMoment.value = undefined;
    });

    it('clears the selection without throwing when the selected moment is JSON null', async () => {
      const {deliveryMoment} = useSelectedValues();
      deliveryMoment.value = 'null';
      const clearSpy = vi.spyOn(useSelectedValues(), 'clearSelectedValues');

      await setupEmptyResult(PackageTypeName.Package);

      expect(clearSpy).toHaveBeenCalled();
      clearSpy.mockRestore();
      deliveryMoment.value = undefined;
    });

    it('clears a dated selection when no dates are available anymore', async () => {
      const {deliveryMoment} = useSelectedValues();
      deliveryMoment.value = JSON.stringify({
        carrier: CarrierName.PostNl,
        date: '2025-01-28',
        deliveryType: DeliveryTypeName.Standard,
        packageType: PackageTypeName.Package,
        shipmentOptions: [],
        time: '09:00-17:00',
      });
      const clearSpy = vi.spyOn(useSelectedValues(), 'clearSelectedValues');

      await setupEmptyResult(PackageTypeName.Package);

      expect(clearSpy).toHaveBeenCalled();
      clearSpy.mockRestore();
      deliveryMoment.value = undefined;
    });
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

  describe('same-day fallback moments', () => {
    // The legacy delivery options API does not support every carrier (e.g. Trunkrs).
    // Same-day carriers without API moments get a synthetic today-moment, but only
    // when another carrier returned real API dates (so a date list exists to extend)
    // and the same-day cutoff has not passed. Without any real API dates, the plain
    // dateless fallback options cover these carriers instead.
    const CUTOFF_NOT_PASSED = '23:59';
    const CUTOFF_PASSED = '00:00';

    afterEach(() => {
      vi.clearAllMocks();
    });

    const setupWithEmptyApi = async (
      carrierSettings: Record<string, Record<string, unknown>>,
    ): Promise<ReturnType<typeof useResolvedDeliveryOptions>> => {
      mockGetDeliveryOptions.mockResolvedValue([]);

      mockDeliveryOptionsConfig(
        getMockDeliveryOptionsConfiguration({
          [KEY_CONFIG]: {
            [KEY_CARRIER_SETTINGS]: carrierSettings,
          },
        }),
      );

      useResolvedDeliveryOptions.clear();
      const options = useResolvedDeliveryOptions();
      void options.load();
      await waitFor(() => expect(options.loading.value).toBe(false), {timeout: 3000});
      await flushPromises();

      return options;
    };

    const setupWithPostNlDates = async (
      trunkrsSettings: Record<string, unknown>,
      postNlDate = '2099-01-02 00:00:00',
    ): Promise<ReturnType<typeof useResolvedDeliveryOptions>> => {
      mockGetDeliveryOptions.mockImplementation((endpoint, opts) => {
        void endpoint;

        if (opts.parameters?.carrier === CarrierName.PostNl) {
          return Promise.resolve([
            {
              date: createTimestamp(postNlDate),
              possibilities: [createDeliveryPossibility(normalizeDate('2099-01-02T15:00:00'))],
            },
          ]);
        }

        return Promise.resolve([]);
      });

      mockDeliveryOptionsConfig(
        getMockDeliveryOptionsConfiguration({
          [KEY_CONFIG]: {
            [KEY_CARRIER_SETTINGS]: {
              [CarrierName.PostNl]: {
                [CarrierSetting.AllowStandardDelivery]: true,
              },
              [CarrierName.Trunkrs]: trunkrsSettings,
            },
          },
        }),
      );

      useResolvedDeliveryOptions.clear();
      const options = useResolvedDeliveryOptions();
      void options.load();
      await waitFor(() => expect(options.loading.value).toBe(false), {timeout: 3000});
      await flushPromises();

      return options;
    };

    it('does not synthesize a same-day moment when no carrier got real API dates', async () => {
      const options = await setupWithEmptyApi({
        [CarrierName.Trunkrs]: {
          [CarrierSetting.AllowSameDayDelivery]: true,
          [CarrierSetting.CutoffTimeSameDay]: CUTOFF_NOT_PASSED,
        },
      });

      expect(options.value).toEqual([]);
    });

    it('synthesizes a tagged today-moment when another carrier has real API dates', async () => {
      const options = await setupWithPostNlDates({
        [CarrierSetting.AllowSameDayDelivery]: true,
        [CarrierSetting.CutoffTimeSameDay]: CUTOFF_NOT_PASSED,
      });

      const trunkrsMoment = options.value.find((moment) => moment.carrier === CarrierName.Trunkrs);
      const postNlMoment = options.value.find((moment) => moment.carrier === CarrierName.PostNl);

      expect(trunkrsMoment?.deliveryType).toBe(CustomDeliveryType.SameDay);
      expect(trunkrsMoment?.date && isToday(new Date(trunkrsMoment.date))).toBe(true);
      expect(trunkrsMoment?.isSynthetic).toBe(true);
      expect(postNlMoment?.isSynthetic).toBeUndefined();
    });

    it('does not synthesize a same-day moment past the same-day cutoff', async () => {
      const options = await setupWithPostNlDates({
        [CarrierSetting.AllowSameDayDelivery]: true,
        [CarrierSetting.CutoffTimeSameDay]: CUTOFF_PASSED,
      });

      expect(options.value.some((moment) => moment.carrier === CarrierName.Trunkrs)).toBe(false);
    });

    it('does not synthesize a same-day moment when same-day delivery is disabled', async () => {
      const options = await setupWithPostNlDates({
        [CarrierSetting.AllowSameDayDelivery]: false,
        [CarrierSetting.CutoffTimeSameDay]: CUTOFF_NOT_PASSED,
      });

      expect(options.value.some((moment) => moment.carrier === CarrierName.Trunkrs)).toBe(false);
    });

    it('reuses the API today date string for synthesized moments so the date list stays deduplicated', async () => {
      // Another carrier may get a real today-date from the API (e.g. DHL For You
      // same-day). The synthetic moment must share that exact date string, since
      // the date string is the join key for the date picker and moment filtering.
      const apiTodayDate = `${format(new Date(), 'yyyy-MM-dd')} 08:30:00`;

      mockGetDeliveryOptions.mockImplementation((endpoint, opts) => {
        void endpoint;

        if (opts.parameters?.carrier === CarrierName.DhlForYou) {
          return Promise.resolve([
            {
              date: createTimestamp(apiTodayDate),
              possibilities: [createDeliveryPossibility(normalizeDate(new Date()))],
            },
          ]);
        }

        return Promise.resolve([]);
      });

      mockDeliveryOptionsConfig(
        getMockDeliveryOptionsConfiguration({
          [KEY_CONFIG]: {
            [KEY_CARRIER_SETTINGS]: {
              [CarrierName.DhlForYou]: {
                [CarrierSetting.AllowStandardDelivery]: true,
                [CarrierSetting.AllowSameDayDelivery]: true,
                [CarrierSetting.CutoffTimeSameDay]: CUTOFF_NOT_PASSED,
              },
              [CarrierName.Trunkrs]: {
                [CarrierSetting.AllowSameDayDelivery]: true,
                [CarrierSetting.CutoffTimeSameDay]: CUTOFF_NOT_PASSED,
              },
            },
          },
        }),
      );

      useResolvedDeliveryOptions.clear();
      const options = useResolvedDeliveryOptions();
      void options.load();
      await waitFor(() => expect(options.loading.value).toBe(false), {timeout: 3000});
      await flushPromises();

      const trunkrsMoment = options.value.find((moment) => moment.carrier === CarrierName.Trunkrs);
      const dhlMoment = options.value.find((moment) => moment.carrier === CarrierName.DhlForYou);

      expect(dhlMoment?.date).toBe(apiTodayDate);
      expect(trunkrsMoment?.date).toBe(apiTodayDate);
    });

    it('does not synthesize a same-day moment when the API returns dates without today', async () => {
      // The API is authoritative when it responds with dates: a carrier that
      // supports both same-day and standard delivery, but gets no today-date
      // back, must only render the dates the API returned.
      mockGetDeliveryOptions.mockResolvedValue([
        {
          date: createTimestamp('2099-01-02 00:00:00'),
          possibilities: [createDeliveryPossibility(normalizeDate('2099-01-02T15:00:00'))],
        },
      ]);

      mockDeliveryOptionsConfig(
        getMockDeliveryOptionsConfiguration({
          [KEY_CONFIG]: {
            [KEY_CARRIER_SETTINGS]: {
              [CarrierName.DhlForYou]: {
                [CarrierSetting.AllowStandardDelivery]: true,
                [CarrierSetting.AllowSameDayDelivery]: true,
                [CarrierSetting.CutoffTimeSameDay]: CUTOFF_NOT_PASSED,
              },
            },
          },
        }),
      );

      useResolvedDeliveryOptions.clear();
      const options = useResolvedDeliveryOptions();
      void options.load();
      await waitFor(() => expect(options.loading.value).toBe(false), {timeout: 3000});
      await flushPromises();

      const deliveryTypes = options.value.map((moment) => moment.deliveryType);

      expect(deliveryTypes).toContain(DeliveryTypeName.Standard);
      expect(deliveryTypes).not.toContain(CustomDeliveryType.SameDay);
    });

    it('does not synthesize a same-day moment for carriers without same-day support', async () => {
      const options = await setupWithEmptyApi({
        [CarrierName.PostNl]: {
          [CarrierSetting.AllowStandardDelivery]: true,
          [CarrierSetting.AllowSameDayDelivery]: true,
          [CarrierSetting.CutoffTimeSameDay]: CUTOFF_NOT_PASSED,
        },
      });

      expect(options.value).toEqual([]);
    });
  });

  it('skips API call for carriers that do not support the configured package type', async () => {
    mockGetDeliveryOptions.mockReturnValue(
      Promise.resolve([
        {
          date: createTimestamp(normalizeDate('2022-01-01T15:00:00Z')),
          possibilities: [createDeliveryPossibility(normalizeDate('2022-01-01T15:00:00Z'))],
        },
      ]),
    );

    mockDeliveryOptionsConfig(
      getMockDeliveryOptionsConfiguration({
        [KEY_CONFIG]: {
          [CarrierSetting.PackageType]: 'mailbox',
          [CarrierSetting.AllowStandardDelivery]: true,
          [KEY_CARRIER_SETTINGS]: {
            [CarrierName.PostNl]: {
              [CarrierSetting.AllowStandardDelivery]: true,
            },
          },
        },
      }),
    );

    await waitForDeliveryOptions();

    const options = useResolvedDeliveryOptions();

    // PostNL supports mailbox in mock capabilities, so it should have results.
    // DhlForYou does NOT support mailbox, so it should be skipped.
    const carriers = new Set(options.value.map((opt) => opt.carrier));

    expect(carriers.has(CarrierName.PostNl)).toBe(true);
    expect(carriers.has(CarrierName.DhlForYou)).toBe(false);
    // only 1 call should be made for PostNL, DhlForYou should be skipped entirely.
    expect(mockGetDeliveryOptions).toHaveBeenCalledTimes(1);
  });
});
