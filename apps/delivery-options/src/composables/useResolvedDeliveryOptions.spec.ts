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
});
