import {beforeEach, describe, expect, it} from 'vitest';
import {CarrierSetting, KEY_CARRIER_SETTINGS, KEY_CONFIG} from '@myparcel-dev/do-shared';
import {CarrierName} from '@myparcel-dev/constants';
import {useConfigStore} from '../stores';
import {mockDeliveryOptionsConfig} from '../__tests__';
import {getResolvedValue} from './getResolvedValue';

describe('getResolvedValue', () => {
  beforeEach(() => {
    useConfigStore().reset();
  });

  it('returns the general value when no carrier is given', () => {
    mockDeliveryOptionsConfig({
      [KEY_CONFIG]: {
        [CarrierSetting.AllowSignature]: true,
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
            [CarrierSetting.AllowSignature]: false,
          },
        },
      },
    });

    expect(getResolvedValue(CarrierSetting.AllowSignature)).toBe(true);
  });

  it('returns the carrier value when a carrier is given', () => {
    mockDeliveryOptionsConfig({
      [KEY_CONFIG]: {
        [CarrierSetting.AllowSignature]: true,
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
            [CarrierSetting.AllowSignature]: false,
          },
        },
      },
    });

    expect(getResolvedValue(CarrierSetting.AllowSignature, CarrierName.PostNl)).toBe(false);
  });

  it('returns the general value when a carrier is given but no carrier settings are available', () => {
    mockDeliveryOptionsConfig({
      [KEY_CONFIG]: {
        [CarrierSetting.AllowSignature]: true,
      },
    });

    expect(getResolvedValue(CarrierSetting.AllowSignature, CarrierName.PostNl)).toBe(true);
  });
});
