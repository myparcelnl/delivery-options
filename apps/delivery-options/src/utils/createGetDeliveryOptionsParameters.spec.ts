import {beforeEach, describe, expect, it} from 'vitest';
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

  it.each([
    {
      platform: PlatformName.MyParcel,
      carrier: CarrierName.PostNl,
      config: {
        [CarrierSetting.AllowMondayDelivery]: true,
        [CarrierSetting.AllowPackageTypeMailbox]: true,
        [CarrierSetting.AllowSaturdayDelivery]: true,
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
        include: 'shipment_options',
      },
    },
  ] satisfies TestInput[])('returns the correct parameters', async ({carrier, platform, config, output}) => {
    expect.assertions(1);
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
