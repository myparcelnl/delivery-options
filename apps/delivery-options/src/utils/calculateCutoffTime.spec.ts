import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {CUTOFF_TIME_DEFAULT, DAY_MONDAY, DAY_TUESDAY, type InputDeliveryOptionsConfig} from '@myparcel-do/shared';
import {CarrierName} from '@myparcel/constants';
import {useCurrentPlatform} from '../composables';
import {mockDeliveryOptionsConfig} from '../__tests__';
import {getResolvedCarrier} from './getResolvedCarrier';
import {calculateCutoffTime} from './calculateCutoffTime';

interface TestInput {
  config: Partial<InputDeliveryOptionsConfig>;
  date: Date;
  result: string;
  when: string;
}

describe('calculateCutoffTime', () => {
  const TUESDAY_08_00 = new Date('2021-01-04T08:00:00.000Z') as Readonly<Date>;
  const TUESDAY_14_00 = new Date('2021-01-04T14:00:00.000Z') as Readonly<Date>;
  const TUESDAY_20_00 = new Date('2021-01-04T20:00:00.000Z') as Readonly<Date>;
  const FRIDAY_08_00 = new Date('2021-01-08T08:00:00.000Z') as Readonly<Date>;
  const FRIDAY_14_00 = new Date('2021-01-08T14:00:00.000Z') as Readonly<Date>;
  const FRIDAY_20_00 = new Date('2021-01-08T20:00:00.000Z') as Readonly<Date>;

  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.setSystemTime(vi.getRealSystemTime());
  });

  it.each([
    {
      when: 'default config is used',
      date: TUESDAY_08_00,
      config: {},
      result: CUTOFF_TIME_DEFAULT,
    },
    {
      when: 'it is set globally and no carrier specific cutoff time is set',
      date: TUESDAY_08_00,
      config: {cutoffTime: '17:00'},
      result: '17:00',
    },
    {
      when: 'it is set in the carrier',
      date: TUESDAY_08_00,
      config: {cutoffTime: '17:00', carrierSettings: {[CarrierName.PostNl]: {cutoffTime: '15:00'}}},
      result: '15:00',
    },
    {
      when: 'same day delivery is disabled',
      date: TUESDAY_08_00,
      config: {cutoffTimeSameDay: '10:00', cutoffTime: '17:00', allowSameDayDelivery: false},
      result: '17:00',
    },
    {
      when: 'same day delivery is enabled and its cutoff time is before the current time',
      date: TUESDAY_08_00,
      config: {cutoffTimeSameDay: '10:00', cutoffTime: '17:00', allowSameDayDelivery: true},
      result: '10:00',
    },

    {
      when: 'same day delivery is enabled but its cutoff time is after the current time',
      date: TUESDAY_14_00,
      config: {cutoffTimeSameDay: '10:00', cutoffTime: '17:00', allowSameDayDelivery: true},
      result: '17:00',
    },

    {
      when: 'drop off possibilities for today are passed',
      date: TUESDAY_08_00,
      config: {
        dropOffPossibilities: [
          {
            day: DAY_MONDAY,
            cutoffTime: '15:00',
            cutoffTimeSameDay: '09:00',
          },
          {
            day: DAY_TUESDAY,
            cutoffTime: '17:00',
            cutoffTimeSameDay: '09:00',
          },
        ],
      },
      result: '17:00',
    },

    {
      when: 'drop off possibilities for today are passed and same day cutoff time has not passed',
      date: TUESDAY_08_00,
      config: {
        allowSameDayDelivery: true,
        dropOffPossibilities: [
          {
            day: DAY_MONDAY,
            cutoffTime: '15:00',
            cutoffTimeSameDay: '09:00',
          },
          {
            day: DAY_TUESDAY,
            cutoffTime: '17:00',
            cutoffTimeSameDay: '09:00',
          },
        ],
      },
      result: '09:00',
    },
  ] satisfies TestInput[])(`returns $result when $when`, async ({result, date, config}) => {
    expect.assertions(1);
    vi.setSystemTime(date.getTime());

    mockDeliveryOptionsConfig({config});

    const platform = useCurrentPlatform();

    const resolvedCarrier = await getResolvedCarrier(CarrierName.PostNl, platform.name.value);
    const actual = calculateCutoffTime(resolvedCarrier);

    expect(actual).toBe(result);
  });
});
