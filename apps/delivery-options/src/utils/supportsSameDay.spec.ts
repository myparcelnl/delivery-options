import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {flushPromises} from '@vue/test-utils';
import {KEY_CONFIG, CarrierSetting, KEY_CARRIER_SETTINGS} from '@myparcel-dev/do-shared';
import {CarrierName} from '@myparcel-dev/constants';
import {useConfigStore} from '../stores';
import {mockDeliveryOptionsConfig} from '../__tests__';
import {supportsSameDay} from './supportsSameDay';
import {getResolvedCarrier} from './getResolvedCarrier';

const getSupportsSameDay = async (carrierName: string = CarrierName.Trunkrs): Promise<boolean> => {
  const resolvedCarrier = getResolvedCarrier(carrierName as CarrierName);

  await flushPromises();

  return supportsSameDay(resolvedCarrier);
};

describe('supportsSameDay', () => {
  beforeEach(() => {
    useConfigStore().reset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('is true for a same-day capable carrier with same-day enabled', async () => {
    mockDeliveryOptionsConfig({
      [KEY_CONFIG]: {
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.Trunkrs]: {
            [CarrierSetting.AllowSameDayDelivery]: true,
          },
        },
      },
    });

    await expect(getSupportsSameDay()).resolves.toBe(true);
  });

  it('is true regardless of the cutoff time having passed', async () => {
    mockDeliveryOptionsConfig({
      [KEY_CONFIG]: {
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.Trunkrs]: {
            [CarrierSetting.AllowSameDayDelivery]: true,
            [CarrierSetting.CutoffTimeSameDay]: '00:00',
          },
        },
      },
    });

    await expect(getSupportsSameDay()).resolves.toBe(true);
  });

  it('is false when same-day delivery is disabled', async () => {
    mockDeliveryOptionsConfig({
      [KEY_CONFIG]: {
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.Trunkrs]: {
            [CarrierSetting.AllowSameDayDelivery]: false,
          },
        },
      },
    });

    await expect(getSupportsSameDay()).resolves.toBe(false);
  });

  it('is false for carriers without same-day capability', async () => {
    mockDeliveryOptionsConfig({
      [KEY_CONFIG]: {
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
            [CarrierSetting.AllowSameDayDelivery]: true,
          },
        },
      },
    });

    await expect(getSupportsSameDay(CarrierName.PostNl)).resolves.toBe(false);
  });
});
