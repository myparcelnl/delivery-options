import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {flushPromises} from '@vue/test-utils';
import {KEY_CONFIG, CarrierSetting, KEY_CARRIER_SETTINGS} from '@myparcel-dev/do-shared';
import {CarrierName} from '@myparcel-dev/constants';
import {useConfigStore} from '../stores';
import {mockDeliveryOptionsConfig} from '../__tests__';
import {getResolvedCarrier} from './getResolvedCarrier';
import {isSameDayAvailable} from './isSameDayAvailable';

// 2021-01-04 is a Monday: getDay() === 1.
const MONDAY_15_00 = new Date('2021-01-04T15:00') as Readonly<Date>;

const getIsSameDayAvailable = async (carrierName: string = CarrierName.Trunkrs): Promise<boolean> => {
  const resolvedCarrier = getResolvedCarrier(carrierName as CarrierName);

  await flushPromises();

  return isSameDayAvailable(resolvedCarrier);
};

describe('isSameDayAvailable', () => {
  beforeEach(() => {
    useConfigStore().reset();
    vi.setSystemTime(MONDAY_15_00);
  });

  afterEach(() => {
    vi.setSystemTime(vi.getRealSystemTime());
  });

  it('uses the same-day cutoff from the current drop-off day', async () => {
    mockDeliveryOptionsConfig({
      [KEY_CONFIG]: {
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.Trunkrs]: {
            [CarrierSetting.AllowSameDayDelivery]: true,
            [CarrierSetting.DropOffDays]: [
              {weekday: 1, cutoffTime: '17:00', [CarrierSetting.CutoffTimeSameDay]: '23:30'},
            ],
          },
        },
      },
    });

    await expect(getIsSameDayAvailable()).resolves.toBe(true);
  });

  it('is unavailable past the drop-off day same-day cutoff', async () => {
    mockDeliveryOptionsConfig({
      [KEY_CONFIG]: {
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.Trunkrs]: {
            [CarrierSetting.AllowSameDayDelivery]: true,
            [CarrierSetting.DropOffDays]: [
              {weekday: 1, cutoffTime: '17:00', [CarrierSetting.CutoffTimeSameDay]: '14:00'},
            ],
          },
        },
      },
    });

    await expect(getIsSameDayAvailable()).resolves.toBe(false);
  });

  it('falls back to the flat same-day cutoff when the drop-off day has none', async () => {
    mockDeliveryOptionsConfig({
      [KEY_CONFIG]: {
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.Trunkrs]: {
            [CarrierSetting.AllowSameDayDelivery]: true,
            [CarrierSetting.CutoffTimeSameDay]: '16:00',
            [CarrierSetting.DropOffDays]: [{weekday: 1, cutoffTime: '17:00'}],
          },
        },
      },
    });

    await expect(getIsSameDayAvailable()).resolves.toBe(true);
  });

  it('is unavailable for carriers without same-day support', async () => {
    mockDeliveryOptionsConfig({
      [KEY_CONFIG]: {
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
            [CarrierSetting.AllowSameDayDelivery]: true,
            [CarrierSetting.DropOffDays]: [
              {weekday: 1, cutoffTime: '17:00', [CarrierSetting.CutoffTimeSameDay]: '23:30'},
            ],
          },
        },
      },
    });

    await expect(getIsSameDayAvailable(CarrierName.PostNl)).resolves.toBe(false);
  });
});
