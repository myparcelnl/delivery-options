import * as CONFIG from '@/data/keys/configKeys';
import { BPOST, DPD, INSTABOX, POSTNL } from '@/data/keys/carrierKeys';
import { FRIDAY, MONDAY, SATURDAY, SUNDAY, THURSDAY, TUESDAY, WEDNESDAY } from '@/config/extraDeliveryConfig';
import { MYPARCEL, SENDMYPARCEL } from '@/data/keys/platformKeys';
import MockDate from 'mockdate';
import { checkIsDropOffDay } from '@/helpers/delivery/checkIsDropOffDay';
import { dayjs } from '@Tests/dayjs';
import { getExtraDropOffDay } from '@/delivery-options/data/request/getExtraDropOffDay';
import { mockConfigBus } from '@Tests/unit/delivery-options/mockConfigBus';

describe('Delivery moments', () => {
  afterEach(() => {
    MockDate.reset();
  });

  test.each`
    platform        | carrier     | weekday      | expected
    ${MYPARCEL}     | ${POSTNL}   | ${MONDAY}    | ${false}
    ${MYPARCEL}     | ${POSTNL}   | ${TUESDAY}   | ${false}
    ${MYPARCEL}     | ${POSTNL}   | ${WEDNESDAY} | ${false}
    ${MYPARCEL}     | ${POSTNL}   | ${THURSDAY}  | ${false}
    ${MYPARCEL}     | ${POSTNL}   | ${FRIDAY}    | ${false}
    ${MYPARCEL}     | ${POSTNL}   | ${SATURDAY}  | ${true}
    ${MYPARCEL}     | ${POSTNL}   | ${SUNDAY}    | ${false}
    ${MYPARCEL}     | ${INSTABOX} | ${SATURDAY}  | ${false}
    ${SENDMYPARCEL} | ${BPOST}    | ${MONDAY}    | ${false}
    ${SENDMYPARCEL} | ${BPOST}    | ${TUESDAY}   | ${false}
    ${SENDMYPARCEL} | ${BPOST}    | ${WEDNESDAY} | ${false}
    ${SENDMYPARCEL} | ${BPOST}    | ${THURSDAY}  | ${false}
    ${SENDMYPARCEL} | ${BPOST}    | ${FRIDAY}    | ${true}
    ${SENDMYPARCEL} | ${BPOST}    | ${SATURDAY}  | ${false}
    ${SENDMYPARCEL} | ${BPOST}    | ${SUNDAY}    | ${false}
    ${SENDMYPARCEL} | ${DPD}      | ${FRIDAY}    | ${false}
    ${SENDMYPARCEL} | ${POSTNL}   | ${FRIDAY}    | ${false}
  `('handles extra dropoff day for $platform, $carrier on day $weekday correctly', ({
    platform,
    carrier,
    weekday,
    expected,
  }) => {
    const date = dayjs().weekday(weekday).set('h', 10).set('m', 0).toDate();
    MockDate.set(date);

    const configBus = mockConfigBus({
      [CONFIG.KEY]: {
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
  });
});
