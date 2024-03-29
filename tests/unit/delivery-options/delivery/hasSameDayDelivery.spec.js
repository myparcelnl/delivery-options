import * as CARRIERS from '@/data/keys/carrierKeys';
import { DHL_FOR_YOU } from '@/data/keys/carrierKeys';
import * as CONFIG from '@/data/keys/configKeys';
import * as Mockdate from 'mockdate';
import { hasSameDayDelivery } from '@/helpers/delivery/hasSameDayDelivery';
import { mockConfigBus } from '@Tests/unit/delivery-options/mockConfigBus';

const tuesdayBeforeNormalCutoffTime = '2020-03-10T14:30:00';
const tuesdayPastNormalCutoffTime = '2020-03-10T17:30:00';
const wednesdayBeforeSameDayCutoffTime = '2020-03-11T06:00:00';
const wednesdayAfterSameDayCutoffTime = '2020-03-14T10:00:00';
const wednesdayAfterNormalDayCutoffTime = '2020-03-14T18:00:00';

describe('hasSameDayDelivery', () => {
  let configBus;

  beforeAll(() => {
    configBus = mockConfigBus({
      [CONFIG.KEY]: {
        [CONFIG.CARRIER_SETTINGS]: {
          [CARRIERS.DHL_FOR_YOU]: {
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
    carrier        | name                                         | time                                 | hasSameDay
    ${DHL_FOR_YOU} | ${'tuesday before normal cut-off time'}      | ${tuesdayBeforeNormalCutoffTime}     | ${false}
    ${DHL_FOR_YOU} | ${'tuesday past normal cut-off time'}        | ${tuesdayPastNormalCutoffTime}       | ${true}
    ${DHL_FOR_YOU} | ${'wednesday before same day cut-off time'}  | ${wednesdayBeforeSameDayCutoffTime}  | ${true}
    ${DHL_FOR_YOU} | ${'wednesday after same day cut-off time'}   | ${wednesdayAfterSameDayCutoffTime}   | ${false}
    ${DHL_FOR_YOU} | ${'wednesday after normal day cut-off time'} | ${wednesdayAfterNormalDayCutoffTime} | ${true}
  `('with $carrier, on $name, should return $hasSameDay for same day delivery', ({ carrier, time, hasSameDay }) => {
    Mockdate.set(time);
    expect(hasSameDayDelivery(carrier, configBus)).toBe(hasSameDay);
  });
});
