import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
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
} from '@myparcel-dev/shared';
import {CarrierName} from '@myparcel/constants';
import {useConfigStore, useAddressStore} from '../stores';
import {useCurrentPlatform} from '../composables';
import {mockDeliveryOptionsConfig} from '../__tests__';
import {getResolvedCarrier} from './getResolvedCarrier';
import {calculateCutoffTime} from './calculateCutoffTime';

const getCalculatedCutoffTime = (): TimestampString => {
  const platform = useCurrentPlatform();
  const resolvedCarrier = getResolvedCarrier(CarrierName.DhlForYou, platform.name.value);

  return calculateCutoffTime(resolvedCarrier);
};

describe('calculateCutoffTime', () => {
  const TUESDAY_08_00 = new Date('2021-01-04T08:00') as Readonly<Date>;
  const TUESDAY_20_00 = new Date('2021-01-04T20:00') as Readonly<Date>;
  const FRIDAY_08_00 = new Date('2021-01-08T08:00') as Readonly<Date>;

  beforeEach(() => {
    useConfigStore().reset();
    useAddressStore().reset();
    vi.setSystemTime(TUESDAY_08_00);

    mockDeliveryOptionsConfig({[KEY_CONFIG]: getDefaultCarrierSettings()});
  });

  afterEach(() => {
    vi.setSystemTime(vi.getRealSystemTime());
  });

  it('returns the default cutoff time when nothing is passed', () => {
    expect.assertions(1);

    expect(getCalculatedCutoffTime()).toBe(CUTOFF_TIME_DEFAULT);
  });

  it('returns the global cutoff time', () => {
    expect.assertions(1);
    mockDeliveryOptionsConfig({
      [KEY_CONFIG]: {
        [CarrierSetting.CutoffTime]: '17:00',
      },
    });
    expect(getCalculatedCutoffTime()).toBe('17:00');
  });

  it('returns the carrier specific cutoff time', () => {
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

    expect(getCalculatedCutoffTime()).toBe('15:00');
  });

  it('returns the default same day cutoff time when same day delivery is enabled', () => {
    expect.assertions(1);

    mockDeliveryOptionsConfig({
      [KEY_CONFIG]: {
        [CarrierSetting.AllowSameDayDelivery]: true,
      },
    });

    expect(getCalculatedCutoffTime()).toBe(CUTOFF_TIME_SAME_DAY_DEFAULT);
  });

  it('returns the custom same day cutoff time when same day delivery is enabled', () => {
    expect.assertions(1);

    mockDeliveryOptionsConfig({
      [KEY_CONFIG]: {
        [CarrierSetting.AllowSameDayDelivery]: true,
        [CarrierSetting.CutoffTimeSameDay]: '12:00',
      },
    });

    expect(getCalculatedCutoffTime()).toBe('12:00');
  });

  it('returns 23:59 when same day delivery is enabled and its cutoff time has passed', () => {
    expect.assertions(1);

    vi.setSystemTime(TUESDAY_20_00);

    mockDeliveryOptionsConfig({
      [KEY_CONFIG]: {
        [CarrierSetting.AllowSameDayDelivery]: true,
        [CarrierSetting.CutoffTimeSameDay]: '12:00',
      },
    });

    expect(getCalculatedCutoffTime()).toBe('23:59');
  });

  it('returns specific cutoff time for current day if passed', () => {
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

    expect(getCalculatedCutoffTime()).toBe('14:30');
  });

  it('returns carrier specific cutoff time for current day if passed', () => {
    expect.assertions(1);

    vi.setSystemTime(FRIDAY_08_00);

    mockDeliveryOptionsConfig({
      [KEY_CONFIG]: {
        [CarrierSetting.DropOffDays]: [
          {
            [DROP_OFF_WEEKDAY]: DAY_FRIDAY,
            [CarrierSetting.CutoffTime]: '14:30',
          },
        ],
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.DhlForYou]: {
            [CarrierSetting.DropOffDays]: [
              {
                [DROP_OFF_WEEKDAY]: DAY_FRIDAY,
                [CarrierSetting.CutoffTime]: '14:29',
              },
            ],
          },
        },
      },
    });

    expect(getCalculatedCutoffTime()).toBe('14:29');
  });

  it('returns specific same day cutoff time for current day if passed', () => {
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

    expect(getCalculatedCutoffTime()).toBe('08:45');
  });

  it('supports string weekdays in dropOffDays', () => {
    expect.assertions(1);

    vi.setSystemTime(FRIDAY_08_00);

    mockDeliveryOptionsConfig({
      [KEY_CONFIG]: {
        [CarrierSetting.DropOffDays]: [
          {
            [DROP_OFF_WEEKDAY]: `${DAY_FRIDAY}`,
            [CarrierSetting.CutoffTime]: '11:29',
          },
        ],
      },
    });

    expect(getCalculatedCutoffTime()).toBe('11:29');
  });
});
