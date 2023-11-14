import {afterEach, describe, expect, test} from 'vitest';
import dayjs from 'dayjs';
import {
  BPOST,
  CONFIG,
  DPD,
  FRIDAY,
  KEY_CONFIG,
  MONDAY,
  MYPARCEL,
  POSTNL,
  SATURDAY,
  SENDMYPARCEL,
  SUNDAY,
  THURSDAY,
  TUESDAY,
  WEDNESDAY,
} from '@myparcel-do/shared';
import {mockConfigBus} from '../mockConfigBus';
import {getExtraDropOffDay} from '../../../legacy/data';

describe('Delivery moments', () => {
  afterEach(() => {
    MockDate.reset();
  });

  test.each`
    platform        | carrier   | weekday      | expected
    ${MYPARCEL}     | ${POSTNL} | ${MONDAY}    | ${false}
    ${MYPARCEL}     | ${POSTNL} | ${TUESDAY}   | ${false}
    ${MYPARCEL}     | ${POSTNL} | ${WEDNESDAY} | ${false}
    ${MYPARCEL}     | ${POSTNL} | ${THURSDAY}  | ${false}
    ${MYPARCEL}     | ${POSTNL} | ${FRIDAY}    | ${false}
    ${MYPARCEL}     | ${POSTNL} | ${SATURDAY}  | ${true}
    ${MYPARCEL}     | ${POSTNL} | ${SUNDAY}    | ${false}
    ${SENDMYPARCEL} | ${BPOST}  | ${MONDAY}    | ${false}
    ${SENDMYPARCEL} | ${BPOST}  | ${TUESDAY}   | ${false}
    ${SENDMYPARCEL} | ${BPOST}  | ${WEDNESDAY} | ${false}
    ${SENDMYPARCEL} | ${BPOST}  | ${THURSDAY}  | ${false}
    ${SENDMYPARCEL} | ${BPOST}  | ${FRIDAY}    | ${true}
    ${SENDMYPARCEL} | ${BPOST}  | ${SATURDAY}  | ${false}
    ${SENDMYPARCEL} | ${BPOST}  | ${SUNDAY}    | ${false}
    ${SENDMYPARCEL} | ${DPD}    | ${FRIDAY}    | ${false}
    ${SENDMYPARCEL} | ${POSTNL} | ${FRIDAY}    | ${false}
  `(
    'handles extra dropoff day for $platform, $carrier on day $weekday correctly',
    ({platform, carrier, weekday, expected}) => {
      const date = dayjs().weekday(weekday).set('h', 10).set('m', 0).toDate();
      MockDate.set(date);

      const configBus = mockConfigBus({
        [KEY_CONFIG]: {
          [CONFIG.PLATFORM]: platform,
          [CONFIG.DROP_OFF_DAYS]: [0, 1, 2, 3, 4, 5, 6],
          [CONFIG.CARRIER_SETTINGS]: {
            [carrier]: {
              [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
              [CONFIG.ALLOW_MONDAY_DELIVERY]: true,
              [CONFIG.ALLOW_SATURDAY_DELIVERY]: true,
            },
          },
        },
      });

      const extraDropOffDay = getExtraDropOffDay(configBus);
      const todayIsExtraDropOffDay = extraDropOffDay && checkIsDropOffDay(extraDropOffDay.dropOffDay, configBus);
      expect(todayIsExtraDropOffDay)[expected ? 'toBeTruthy' : 'toBeFalsy']();
    },
  );
});
