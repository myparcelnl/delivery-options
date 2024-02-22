import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {
  CUTOFF_TIME_DEFAULT,
  getDefaultCarrierSettings,
  KEY_CONFIG,
  CarrierSetting,
  KEY_CARRIER_SETTINGS,
  CUTOFF_TIME_SAME_DAY_DEFAULT,
  type TimestampString,
  DAY_FRIDAY,
  DROP_OFF_WEEKDAY,
} from '@myparcel-do/shared';
import {CarrierName} from '@myparcel/constants';
import {useCurrentPlatform} from '../composables';
import {mockDeliveryOptionsConfig} from '../__tests__';
import {getResolvedCarrier} from './getResolvedCarrier';
import {calculateCutoffTime} from './calculateCutoffTime';

const getCalculatedCutoffTime = async (): Promise<TimestampString> => {
  const platform = useCurrentPlatform();
  const resolvedCarrier = await getResolvedCarrier(CarrierName.DhlForYou, platform.name.value);

  return calculateCutoffTime(resolvedCarrier);
};

describe('calculateCutoffTime', () => {
  const TUESDAY_08_00 = new Date('2021-01-04T08:00:00.000Z') as Readonly<Date>;
  const TUESDAY_14_00 = new Date('2021-01-04T14:00:00.000Z') as Readonly<Date>;
  const TUESDAY_20_00 = new Date('2021-01-04T20:00:00.000Z') as Readonly<Date>;
  const FRIDAY_08_00 = new Date('2021-01-08T08:00:00.000Z') as Readonly<Date>;
  const FRIDAY_14_00 = new Date('2021-01-08T14:00:00.000Z') as Readonly<Date>;
  const FRIDAY_20_00 = new Date('2021-01-08T20:00:00.000Z') as Readonly<Date>;

  beforeEach(() => {
    setActivePinia(createPinia());
    vi.setSystemTime(TUESDAY_08_00);

    mockDeliveryOptionsConfig({[KEY_CONFIG]: getDefaultCarrierSettings()});
  });

  afterEach(() => {
    vi.setSystemTime(vi.getRealSystemTime());
  });

  it('returns the default cutoff time when nothing is passed', async () => {
    expect.assertions(1);

    expect(await getCalculatedCutoffTime()).toBe(CUTOFF_TIME_DEFAULT);
  });

  it('returns the global cutoff time', async () => {
    expect.assertions(1);

    mockDeliveryOptionsConfig({[KEY_CONFIG]: {[CarrierSetting.CutoffTime]: '17:00'}});

    expect(await getCalculatedCutoffTime()).toBe('17:00');
  });

  it('returns the carrier specific cutoff time', async () => {
    expect.assertions(1);

    mockDeliveryOptionsConfig({
      [KEY_CONFIG]: {
        [CarrierSetting.CutoffTime]: '17:00',
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.DhlForYou]: {
            [CarrierSetting.CutoffTime]: '15:00',
          },
        },
      },
    });

    expect(await getCalculatedCutoffTime()).toBe('15:00');
  });

  it('returns the default same day cutoff time when same day delivery is enabled', async () => {
    expect.assertions(1);

    mockDeliveryOptionsConfig({
      [KEY_CONFIG]: {
        [CarrierSetting.AllowSameDayDelivery]: true,
      },
    });

    expect(await getCalculatedCutoffTime()).toBe(CUTOFF_TIME_SAME_DAY_DEFAULT);
  });

  it('returns the custom same day cutoff time when same day delivery is enabled', async () => {
    expect.assertions(1);

    mockDeliveryOptionsConfig({
      [KEY_CONFIG]: {
        [CarrierSetting.AllowSameDayDelivery]: true,
        [CarrierSetting.CutoffTimeSameDay]: '12:00',
      },
    });

    expect(await getCalculatedCutoffTime()).toBe('12:00');
  });

  it('returns 23:59 when same day delivery is enabled and its cutoff time has passed', async () => {
    expect.assertions(1);

    vi.setSystemTime(TUESDAY_20_00);

    mockDeliveryOptionsConfig({
      [KEY_CONFIG]: {
        [CarrierSetting.AllowSameDayDelivery]: true,
        [CarrierSetting.CutoffTimeSameDay]: '12:00',
      },
    });

    expect(await getCalculatedCutoffTime()).toBe('23:59');
  });

  it('returns specific cutoff time for current day if passed', async () => {
    expect.assertions(1);

    vi.setSystemTime(FRIDAY_08_00);

    mockDeliveryOptionsConfig({
      [KEY_CONFIG]: {
        [CarrierSetting.DropOffDays]: [
          {
            [DROP_OFF_WEEKDAY]: DAY_FRIDAY,
            [CarrierSetting.CutoffTime]: '14:30',
            [CarrierSetting.CutoffTimeSameDay]: '08:45',
          },
        ],
      },
    });

    expect(await getCalculatedCutoffTime()).toBe('14:30');
  });

  it('returns specific same day cutoff time for current day if passed', async () => {
    expect.assertions(1);

    vi.setSystemTime(FRIDAY_08_00);

    mockDeliveryOptionsConfig({
      [KEY_CONFIG]: {
        [CarrierSetting.AllowSameDayDelivery]: true,
        [CarrierSetting.DropOffDays]: [
          {
            [DROP_OFF_WEEKDAY]: DAY_FRIDAY,
            [CarrierSetting.CutoffTime]: '14:30',
            [CarrierSetting.CutoffTimeSameDay]: '08:45',
          },
        ],
      },
    });

    expect(await getCalculatedCutoffTime()).toBe('08:45');
  });
});
