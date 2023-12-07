import {beforeEach, describe, expect, it} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {DELIVERY_DAYS_WINDOW_DEFAULT, DROP_OFF_DELAY_DEFAULT, PACKAGE_TYPE_DEFAULT} from '@myparcel-do/shared';
import {CarrierName, PlatformName} from '@myparcel/constants';
import {mockDeliveryOptionsConfig} from '../__tests__';
import {getResolvedCarrier} from './getResolvedCarrier';
import {createGetDeliveryOptionsParameters} from './createGetDeliveryOptionsParameters';

describe('createGetDeliveryOptionsParameters', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('returns the correct parameters', async () => {
    expect.assertions(1);
    mockDeliveryOptionsConfig();

    const car = await getResolvedCarrier(CarrierName.PostNl);

    const parameters = createGetDeliveryOptionsParameters(car);

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
