import {describe, it, expect, beforeEach} from 'vitest';
import {type CarrierCapability, CarrierSetting, KEY_CONFIG} from '@myparcel-dev/do-shared';
import {useConfigStore} from '../stores';
import {mockDeliveryOptionsConfig, getMockDeliveryOptionsConfiguration} from '../__tests__';
import {hasPickupForCarrier} from './hasPickupForCarrier';

const createCapability = (deliveryTypes: string[] = []): CarrierCapability => ({
  carrier: 'POSTNL',
  packageTypes: [],
  deliveryTypes,
  options: {},
});

describe('hasPickupForCarrier', () => {
  beforeEach(() => {
    useConfigStore().reset();
  });

  it('returns true when capability has PICKUP_DELIVERY and config allows pickup', () => {
    mockDeliveryOptionsConfig(
      getMockDeliveryOptionsConfiguration({
        [KEY_CONFIG]: {[CarrierSetting.AllowPickupLocations]: true},
      }),
    );

    expect(hasPickupForCarrier(createCapability(['PICKUP_DELIVERY']))).toBe(true);
  });

  it('returns false when capability has PICKUP_DELIVERY but config disables pickup', () => {
    mockDeliveryOptionsConfig(
      getMockDeliveryOptionsConfiguration({
        [KEY_CONFIG]: {[CarrierSetting.AllowPickupLocations]: false},
      }),
    );

    expect(hasPickupForCarrier(createCapability(['PICKUP_DELIVERY']))).toBe(false);
  });

  it('returns false when capability lacks PICKUP_DELIVERY', () => {
    mockDeliveryOptionsConfig(
      getMockDeliveryOptionsConfiguration({
        [KEY_CONFIG]: {[CarrierSetting.AllowPickupLocations]: true},
      }),
    );

    expect(hasPickupForCarrier(createCapability(['STANDARD_DELIVERY']))).toBe(false);
  });
});
