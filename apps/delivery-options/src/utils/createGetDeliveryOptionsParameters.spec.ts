import {beforeEach, describe, expect, it, vi, afterEach} from 'vitest';
import {assign} from 'radash';
import {createPinia, setActivePinia} from 'pinia';
import {
  type CarrierIdentifier,
  CarrierSetting,
  type InputCarrierSettings,
  KEY_CARRIER_SETTINGS,
  KEY_CONFIG,
} from '@myparcel-do/shared';
import {type EndpointParameters, type GetDeliveryOptions} from '@myparcel/sdk';
import {CarrierName, PackageTypeName, PlatformName} from '@myparcel/constants';
import {getMockDeliveryOptionsConfiguration, mockDeliveryOptionsConfig} from '../__tests__';
import {getResolvedCarrier} from './getResolvedCarrier';
import {createGetDeliveryOptionsParameters} from './createGetDeliveryOptionsParameters';

interface TestInput {
  carrier: CarrierIdentifier;
  config: Partial<InputCarrierSettings>;
  output: Partial<EndpointParameters<GetDeliveryOptions>>;
  platform: PlatformName;
}

describe('createGetDeliveryOptionsParameters', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.setSystemTime(vi.getRealSystemTime());
  });

  it.each([
    {
      platform: PlatformName.MyParcel,
      carrier: CarrierName.PostNl,
      config: {
        [CarrierSetting.AllowMondayDelivery]: true,
        [CarrierSetting.AllowSaturdayDelivery]: true,
        [CarrierSetting.AllowSameDayDelivery]: true,
        [CarrierSetting.CutoffTime]: '13:00',
        [CarrierSetting.DeliveryDaysWindow]: 6,
        [CarrierSetting.DropOffDays]: [1, 4, 5],
        [CarrierSetting.DropOffDelay]: 2,
        [CarrierSetting.PackageType]: PackageTypeName.Mailbox,
      },
      output: {
        platform: PlatformName.MyParcel,
        carrier: CarrierName.PostNl,
        package_type: PackageTypeName.Mailbox,
        cutoff_time: '13:00',
        deliverydays_window: 6,
        dropoff_days: '1;4;5',
        dropoff_delay: 2,
        monday_delivery: true,
        saturday_delivery: false,
        same_day_delivery: false,
        include: 'shipment_options',
      },
    },
    {
      platform: PlatformName.MyParcel,
      carrier: CarrierName.DhlForYou,
      config: {
        [CarrierSetting.AllowMondayDelivery]: true,
        [CarrierSetting.AllowSaturdayDelivery]: true,
        [CarrierSetting.AllowSameDayDelivery]: true,
        [CarrierSetting.CutoffTime]: '16:00',
        [CarrierSetting.CutoffTimeSameDay]: '10:00',
        [CarrierSetting.DeliveryDaysWindow]: 4,
        [CarrierSetting.DropOffDays]: [0, 2, 3, 4],
        [CarrierSetting.DropOffDelay]: 0,
        [CarrierSetting.PackageType]: PackageTypeName.DigitalStamp,
      },
      output: {
        platform: PlatformName.MyParcel,
        carrier: CarrierName.DhlForYou,
        package_type: PackageTypeName.Package,
        cutoff_time: '16:00',
        deliverydays_window: 4,
        dropoff_days: '0;2;3;4',
        dropoff_delay: 0,
        monday_delivery: false,
        saturday_delivery: false,
        same_day_delivery: true,
        include: 'shipment_options',
      },
    },
  ] satisfies TestInput[])('returns the correct parameters', async ({carrier, platform, config, output}) => {
    expect.assertions(1);
    vi.setSystemTime('2021-06-01T17:00:00');

    const configuration = mockDeliveryOptionsConfig(
      getMockDeliveryOptionsConfiguration({[KEY_CONFIG]: {platform, [KEY_CARRIER_SETTINGS]: {[carrier]: {...config}}}}),
    );

    const resolvedCarrier = await getResolvedCarrier(carrier, configuration.config.platform);
    const parameters = createGetDeliveryOptionsParameters(resolvedCarrier);

    expect(parameters).toEqual(
      assign<Partial<EndpointParameters<GetDeliveryOptions>>>(
        {cc: 'NL', city: 'Hoofddorp', postal_code: '2132 JE', street: 'Antareslaan 31'},
        output,
      ),
    );
  });
});
