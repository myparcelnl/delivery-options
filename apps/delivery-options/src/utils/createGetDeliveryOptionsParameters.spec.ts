import {beforeEach, describe, expect, it} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {
  DELIVERY_DAYS_WINDOW_DEFAULT,
  DROP_OFF_DELAY_DEFAULT,
  getMyParcelConfig,
  getSendMyParcelConfig,
  KEY_CONFIG,
  PACKAGE_TYPE_DEFAULT,
} from '@myparcel-do/shared';
import {CarrierName, PackageTypeName, PlatformName} from '@myparcel/constants';
import {getMockDeliveryOptionsConfiguration, mockDeliveryOptionsConfig} from '../__tests__';
import {getResolvedCarrier} from './getResolvedCarrier';
import {createGetDeliveryOptionsParameters} from './createGetDeliveryOptionsParameters';

describe('createGetDeliveryOptionsParameters', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  const platforms = [
    {
      name: PlatformName.MyParcel,
      config: getMyParcelConfig(),
    },
    {
      name: PlatformName.SendMyParcel,
      config: getSendMyParcelConfig(),
    },
  ];

  it('returns the correct parameters', async () => {
    expect.assertions(1);
    mockDeliveryOptionsConfig();

    const defaultConfig = getMockDeliveryOptionsConfiguration({[KEY_CONFIG]: {platform: PlatformName.MyParcel}});

    const platformName = defaultConfig.config.platform;

    const carrier = await getResolvedCarrier(CarrierName.PostNl, platformName);

    const parameters = createGetDeliveryOptionsParameters(
      carrier,
      {packageType: PackageTypeName.Package, platform: platformName},
      defaultConfig.address,
    );

    expect(parameters).toEqual({
      platform: PlatformName.MyParcel,
      carrier: CarrierName.PostNl,
      package_type: PACKAGE_TYPE_DEFAULT,
      cutoff_time: '16:00',
      deliverydays_window: DELIVERY_DAYS_WINDOW_DEFAULT,
      dropoff_days: '1;2;3;4;5',
      dropoff_delay: DROP_OFF_DELAY_DEFAULT,
      monday_delivery: false,
      saturday_delivery: false,
      cc: '',
      city: '',
      postal_code: '',
      street: '',
      include: 'shipment_options',
    });
  });
});
