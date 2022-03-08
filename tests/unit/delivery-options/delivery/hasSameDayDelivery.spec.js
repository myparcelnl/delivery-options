import * as CARRIERS from '@/data/keys/carrierKeys';
import * as CONFIG from '@/data/keys/configKeys';
import * as Mockdate from 'mockdate';
import { hasSameDayDelivery } from '@/delivery-options/data/request/hasSameDayDelivery';
import { mockConfigBus } from '@Tests/unit/delivery-options/mockConfigBus';

const tuesdayBeforeNormalCutoffTime = '2020-03-10T14:30:00';
const tuesdayPastNormalCutoffTime = '2020-03-10T17:30:00';
const wednesdayBeforeSameDayCutOffTime = '2020-03-11T06:00:00';
const wednesdayAfterSameDayCutOffTime = '2020-03-14T10:00:00';
const wednesdayAfterNormalDayCutOffTime = '2020-03-14T18:00:00';

describe('hasSameDayDelivery', () => {
  let configBus;

  beforeAll(() => {
    configBus = mockConfigBus({
      [CONFIG.KEY]: {
        [CONFIG.CARRIER_SETTINGS]: {
          [CARRIERS.INSTABOX]: {
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
    name                                         | time                                 | hasSameDay
    ${'tuesday before normal cutoff time'}       | ${tuesdayBeforeNormalCutoffTime}     | ${false}
    ${'tuesday past normal cutoff time'}         | ${tuesdayPastNormalCutoffTime}       | ${true}
    ${'wednesday before same day cut off time'}  | ${wednesdayBeforeSameDayCutOffTime}  | ${true}
    ${'wednesday after same day cut off time'}   | ${wednesdayAfterSameDayCutOffTime}   | ${false}
    ${'wednesday after normal day cut off time'} | ${wednesdayAfterNormalDayCutOffTime} | ${true}
  `('on $name, should return $hasSameDay for same day delivery', ({ time, hasSameDay }) => {
    Mockdate.set(time);
    expect(hasSameDayDelivery(configBus)).toBe(hasSameDay);
  });
});
