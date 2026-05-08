import {describe, it, expect, beforeEach} from 'vitest';
import {type CarrierCapability, CarrierSetting, KEY_CONFIG, KEY_CARRIER_SETTINGS} from '@myparcel-dev/do-shared';
import {CarrierName} from '@myparcel-dev/constants';
import {useConfigStore} from '../stores';
import {mockDeliveryOptionsConfig, getMockDeliveryOptionsConfiguration} from '../__tests__';
import {hasDeliveryForCarrier} from './hasDeliveryForCarrier';

const createCapability = (
  deliveryTypes: string[] = [],
  options: Record<
    string,
    {requires: string[]; excludes: string[]; isSelectedByDefault: boolean; isRequired: boolean}
  > = {},
): CarrierCapability => ({
  carrier: 'POSTNL',
  packageTypes: [],
  deliveryTypes,
  options,
});

describe('hasDeliveryForCarrier', () => {
  beforeEach(() => {
    useConfigStore().reset();
  });

  it('returns true when capability has standard delivery and config allows it', () => {
    mockDeliveryOptionsConfig(
      getMockDeliveryOptionsConfiguration({
        [KEY_CONFIG]: {[CarrierSetting.AllowStandardDelivery]: true},
      }),
    );

    const cap = createCapability(['STANDARD_DELIVERY']);

    expect(hasDeliveryForCarrier(cap)).toBe(true);
  });

  it('returns false when capability has delivery types but config disables them', () => {
    mockDeliveryOptionsConfig(
      getMockDeliveryOptionsConfiguration({
        [KEY_CONFIG]: {
          [CarrierSetting.AllowStandardDelivery]: false,
          [CarrierSetting.AllowMorningDelivery]: false,
          [CarrierSetting.AllowEveningDelivery]: false,
          [CarrierSetting.AllowExpressDelivery]: false,
        },
      }),
    );

    const cap = createCapability(['STANDARD_DELIVERY', 'MORNING_DELIVERY']);

    expect(hasDeliveryForCarrier(cap)).toBe(false);
  });

  it('returns false when capability has no delivery types', () => {
    mockDeliveryOptionsConfig(
      getMockDeliveryOptionsConfiguration({
        [KEY_CONFIG]: {[CarrierSetting.AllowStandardDelivery]: true},
      }),
    );

    const cap = createCapability([]);

    expect(hasDeliveryForCarrier(cap)).toBe(false);
  });

  it('respects per-carrier config override', () => {
    mockDeliveryOptionsConfig(
      getMockDeliveryOptionsConfiguration({
        [KEY_CONFIG]: {
          [CarrierSetting.AllowStandardDelivery]: true,
          [KEY_CARRIER_SETTINGS]: {
            [CarrierName.PostNl]: {
              [CarrierSetting.AllowStandardDelivery]: false,
            },
          },
        },
      }),
    );

    const cap = createCapability(['STANDARD_DELIVERY']);

    expect(hasDeliveryForCarrier(cap, CarrierName.PostNl)).toBe(false);
  });
});
