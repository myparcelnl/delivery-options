import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {ALLOW_SIGNATURE, CARRIER_SETTINGS, KEY_CONFIG} from '@myparcel-do/shared';
import {CarrierName} from '@myparcel/constants';
import {useCarrierSettings} from '../composables';
import {mockDeliveryOptionsConfig} from '../__tests__';
import {getResolvedValue} from './getResolvedValue';

describe('getResolvedValue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    useCarrierSettings.clear();
  });

  it('returns the general value when no carrier is given', () => {
    mockDeliveryOptionsConfig({
      [KEY_CONFIG]: {
        [ALLOW_SIGNATURE]: true,
        [CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
            [ALLOW_SIGNATURE]: false,
          },
        },
      },
    });

    expect(getResolvedValue(ALLOW_SIGNATURE)).toBe(true);
  });

  it('returns the carrier value when a carrier is given', () => {
    mockDeliveryOptionsConfig({
      [KEY_CONFIG]: {
        [ALLOW_SIGNATURE]: true,
        [CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
            [ALLOW_SIGNATURE]: false,
          },
        },
      },
    });

    expect(getResolvedValue(ALLOW_SIGNATURE, CarrierName.PostNl)).toBe(false);
  });

  it('returns the general value when a carrier is given but no carrier settings are available', () => {
    mockDeliveryOptionsConfig({
      [KEY_CONFIG]: {
        [ALLOW_SIGNATURE]: true,
      },
    });

    expect(getResolvedValue(ALLOW_SIGNATURE, CarrierName.PostNl)).toBe(true);
  });
});
