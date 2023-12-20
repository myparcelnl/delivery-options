import {beforeEach, describe, expect, it} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {CARRIER_SETTINGS, CarrierSetting, ConfigSetting, KEY_CONFIG} from '@myparcel-do/shared';
import {CarrierName, PackageTypeName, PlatformName} from '@myparcel/constants';
import {getMockDeliveryOptionsConfiguration, mockDeliveryOptionsConfig} from '../__tests__';
import {getResolvedCarrier} from './getResolvedCarrier';
import {createGetDeliveryOptionsParameters} from './createGetDeliveryOptionsParameters';

describe('createGetDeliveryOptionsParameters', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('returns the correct parameters', async () => {
    expect.assertions(1);
    const configuration = mockDeliveryOptionsConfig(
      getMockDeliveryOptionsConfiguration({
        [KEY_CONFIG]: {
          [ConfigSetting.Platform]: PlatformName.MyParcel,
          [CARRIER_SETTINGS]: {
            [CarrierName.PostNl]: {
              [CarrierSetting.AllowMondayDelivery]: true,
              [CarrierSetting.AllowPackageTypeMailbox]: true,
              [CarrierSetting.AllowSaturdayDelivery]: true,
              [CarrierSetting.CutoffTime]: '13:00',
              [CarrierSetting.DeliveryDaysWindow]: 6,
              [CarrierSetting.DropOffDays]: [1, 4, 5],
              [CarrierSetting.DropOffDelay]: 2,
              [CarrierSetting.PackageType]: PackageTypeName.Mailbox,
            },
          },
        },
      }),
    );

    const carrier = await getResolvedCarrier(CarrierName.PostNl, configuration.config.platform);

    const parameters = createGetDeliveryOptionsParameters(carrier);

    expect(parameters).toEqual({
      platform: PlatformName.MyParcel,
      carrier: CarrierName.PostNl,
      package_type: PackageTypeName.Mailbox,
      cutoff_time: '13:00',
      deliverydays_window: 6,
      dropoff_days: '1;4;5',
      dropoff_delay: 2,
      monday_delivery: true,
      saturday_delivery: false,
      cc: 'NL',
      city: 'Hoofddorp',
      postal_code: '2132 JE',
      street: 'Antareslaan 31',
      include: 'shipment_options',
    });
  });
});
