import {beforeAll, describe, expect, it} from 'vitest';
import {CONFIG, KEY_CONFIG} from '@myparcel-do/shared';
import {CarrierName} from '@myparcel/constants';
import {mockConfigBus} from '../mockConfigBus';

const tuesdayBeforeNormalCutoffTime = '2020-03-10T14:30:00';
const tuesdayPastNormalCutoffTime = '2020-03-10T17:30:00';
const wednesdayBeforeSameDayCutoffTime = '2020-03-11T06:00:00';
const wednesdayAfterSameDayCutoffTime = '2020-03-14T10:00:00';
const wednesdayAfterNormalDayCutoffTime = '2020-03-14T18:00:00';

describe.skip('hasSameDayDelivery', () => {
  let configBus;

  beforeAll(() => {
    configBus = mockConfigBus({
      [KEY_CONFIG]: {
        [CONFIG.CARRIER_SETTINGS]: {
          [CarrierName.DhlForYou]: {
            [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
            [CONFIG.ALLOW_SAME_DAY_DELIVERY]: true,
            [CONFIG.CUTOFF_TIME]: '16:00',
            [CONFIG.CUTOFF_TIME_SAME_DAY]: '09:00',
          },
        },
      },
    });
  });

  it.each`
    carrier                  | name                                         | time                                 | hasSameDay
    ${CarrierName.DhlForYou} | ${'tuesday before normal cut-off time'}      | ${tuesdayBeforeNormalCutoffTime}     | ${false}
    ${CarrierName.DhlForYou} | ${'tuesday past normal cut-off time'}        | ${tuesdayPastNormalCutoffTime}       | ${true}
    ${CarrierName.DhlForYou} | ${'wednesday before same day cut-off time'}  | ${wednesdayBeforeSameDayCutoffTime}  | ${true}
    ${CarrierName.DhlForYou} | ${'wednesday after same day cut-off time'}   | ${wednesdayAfterSameDayCutoffTime}   | ${false}
    ${CarrierName.DhlForYou} | ${'wednesday after normal day cut-off time'} | ${wednesdayAfterNormalDayCutoffTime} | ${true}
  `('with $carrier, on $name, should return $hasSameDay for same day delivery', ({carrier, time, hasSameDay}) => {
    vi.setSystemTime(time);
    expect(hasSameDayDelivery(carrier, configBus)).toBe(hasSameDay);
  });
});
