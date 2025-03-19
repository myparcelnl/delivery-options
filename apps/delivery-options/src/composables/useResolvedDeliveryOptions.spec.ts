import {describe, it, expect, beforeEach} from 'vitest';
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
} from '@myparcel-do/shared';
import {type RecursivePartial} from '@myparcel/ts-utils';
import {DeliveryTypeName, CarrierName} from '@myparcel/constants';
import {useAddressStore, useConfigStore} from '../stores';
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

const setupUps = async (config: RecursivePartial<InputDeliveryOptionsConfiguration> = {}): Promise<void> => {
  const today = normalizeDate('2022-01-01T09:00:00');
  const tomorrow = normalizeDate('2022-01-02T09:00:00');
  const inTwoDays = normalizeDate('2022-01-03T09:00:00');

  mockGetDeliveryOptions.mockReturnValue(
    Promise.resolve([
      {
        date: createTimestamp(today),
        possibilities: [
          createDeliveryPossibility(tomorrow, {type: DeliveryTypeName.Express}),
          createDeliveryPossibility(inTwoDays, {type: DeliveryTypeName.Express}),
          createDeliveryPossibility(inTwoDays, {type: DeliveryTypeName.Standard}),
        ],
      },
    ]),
  );

  mockDeliveryOptionsConfig(
    getMockDeliveryOptionsConfiguration(
      assign(
        {
          [KEY_CONFIG]: {
            [KEY_CARRIER_SETTINGS]: {
              [CarrierName.Ups]: {
                [CarrierSetting.AllowDeliveryOptions]: true,
                // Provide standard/express setting via config arg.
              },
            },
          },
        },
        config,
      ),
    ),
  );

  await waitForDeliveryOptions(CarrierName.Ups);
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

  it('prefers standard delivery over express in the same time window', async () => {
    await setupUps({
      [KEY_CONFIG]: {
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.Ups]: {
            [CarrierSetting.AllowStandardDelivery]: true,
            [CarrierSetting.AllowExpressDelivery]: true,
          },
        },
      },
    });

    const options = useResolvedDeliveryOptions();
    const resolvedOptions = options.value.map(({carrier, deliveryType}) => ({carrier, deliveryType}));

    // It should prefer standard to express on day 2.
    expect(resolvedOptions).toEqual([
      {carrier: CarrierName.Ups, deliveryType: DeliveryTypeName.Express},
      {carrier: CarrierName.Ups, deliveryType: DeliveryTypeName.Standard},
    ]);
  });

  it('does not filter out standard delivery when express is disabled', async () => {
    await setupUps({
      [KEY_CONFIG]: {
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.Ups]: {
            [CarrierSetting.AllowStandardDelivery]: true,
            [CarrierSetting.AllowExpressDelivery]: false,
          },
        },
      },
    });

    const options = useResolvedDeliveryOptions();

    const resolvedOptions = options.value.map(({carrier, deliveryType}) => ({carrier, deliveryType}));

    // Verify that it doesn't filter out Standard now
    expect(resolvedOptions).toEqual([{carrier: CarrierName.Ups, deliveryType: DeliveryTypeName.Standard}]);
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
      expected.push({carrier: CARRIER_IDENTIFIER_WITH_CONTRACT, deliveryType: DeliveryTypeName.Standard, packageType});
    });
    // Sort expected by carrier name
    // eslint-disable-next-line id-length
    expected.sort((a, b) => a.carrier.localeCompare(b.carrier));
    expect(resolvedOptions).toEqual(expected);
  });
});
