import {beforeEach, describe, expect, it, vi, afterEach} from 'vitest';
import {assign} from 'radash';
import {flushPromises} from '@vue/test-utils';
import {type EndpointParameters, type GetDeliveryOptions} from '@myparcel-dev/sdk';
import {
  type CarrierIdentifier,
  CarrierSetting,
  type InputCarrierSettings,
  KEY_CARRIER_SETTINGS,
  KEY_CONFIG,
} from '@myparcel-dev/do-shared';
import {CarrierName, PackageTypeName, PlatformName} from '@myparcel-dev/constants';
import {useConfigStore} from '../stores';
import {getMockDeliveryOptionsConfiguration, mockDeliveryOptionsConfig} from '../__tests__';
import {getResolvedCarrier} from './getResolvedCarrier';
import {createGetDeliveryOptionsParameters} from './createGetDeliveryOptionsParameters';

const DEFAULT_COUNTRY = 'NL';
const DEFAULT_API_BASE_URL = 'https://api.myparcel.nl';

interface TestInput {
  carrier: CarrierIdentifier;
  config: Partial<InputCarrierSettings>;
  output: Partial<EndpointParameters<GetDeliveryOptions>>;
}

describe('createGetDeliveryOptionsParameters', () => {
  beforeEach(() => {
    useConfigStore().reset();
  });

  afterEach(() => {
    vi.setSystemTime(vi.getRealSystemTime());
  });

  it.each([
    {
      carrier: CarrierName.PostNl,
      config: {
        [CarrierSetting.AllowMondayDelivery]: true,
        [CarrierSetting.CutoffTime]: '13:00',
        [CarrierSetting.DeliveryDaysWindow]: 6,
        [CarrierSetting.DropOffDays]: [1, 4, 5],
        [CarrierSetting.DropOffDelay]: 2,
        [CarrierSetting.PackageType]: PackageTypeName.Mailbox,
      },
      output: {
        carrier: CarrierName.PostNl,
        package_type: PackageTypeName.Mailbox,
        cutoff_time: '13:00',
        deliverydays_window: 6,
        dropoff_days: '1;4;5',
        dropoff_delay: 2,
        monday_delivery: true,
        include: 'shipment_options',
      },
    },
    {
      carrier: CarrierName.DhlForYou,
      config: {
        [CarrierSetting.AllowSameDayDelivery]: true,
        [CarrierSetting.CutoffTime]: '16:00',
        [CarrierSetting.CutoffTimeSameDay]: '12:30',
        [CarrierSetting.DeliveryDaysWindow]: 4,
        [CarrierSetting.DropOffDays]: [0, 2, 3, 4],
        [CarrierSetting.DropOffDelay]: 0,
        [CarrierSetting.PackageType]: PackageTypeName.DigitalStamp,
      },
      output: {
        carrier: CarrierName.DhlForYou,
        package_type: PackageTypeName.Package,
        cutoff_time: '12:30',
        deliverydays_window: 4,
        dropoff_days: '0;2;3;4',
        dropoff_delay: 0,
        same_day_delivery: true,
        include: 'shipment_options',
      },
    },
    {
      carrier: CarrierName.Dpd,
      config: {},
      output: {
        carrier: CarrierName.Dpd,
        package_type: PackageTypeName.Package,
        cutoff_time: '16:00',
        deliverydays_window: 7,
        dropoff_days: '1;2;3;4;5',
        dropoff_delay: 1,
        include: 'shipment_options',
      },
    },
  ] satisfies TestInput[])('returns the correct parameters', async ({carrier, config, output}) => {
    expect.assertions(1);
    vi.setSystemTime('2021-06-01T10:00:00');

    mockDeliveryOptionsConfig(
      getMockDeliveryOptionsConfiguration({[KEY_CONFIG]: {[KEY_CARRIER_SETTINGS]: {[carrier]: {...config}}}}),
    );

    const resolvedCarrier = getResolvedCarrier(carrier, DEFAULT_COUNTRY, DEFAULT_API_BASE_URL);

    await flushPromises();

    const parameters = createGetDeliveryOptionsParameters(resolvedCarrier);

    expect(parameters).toEqual(
      assign<Partial<EndpointParameters<GetDeliveryOptions>>>(
        {platform: PlatformName.MyParcel, cc: 'NL', city: 'Hoofddorp', postal_code: '2132 JE', street: 'Antareslaan 31'},
        output,
      ),
    );
  });
});
