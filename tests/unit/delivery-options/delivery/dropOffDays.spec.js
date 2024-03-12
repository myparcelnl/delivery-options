import * as CONFIG from '@/data/keys/configKeys';
import { BPOST, DPD, POSTNL } from '@/data/keys/carrierKeys';
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
    platform        | carrier     | weekday      | dropOffDays              | expected 
    ${MYPARCEL}     | ${POSTNL}   | ${MONDAY}    | ${[0, 1, 2, 3, 4, 5, 6]} |${false}
    ${MYPARCEL}     | ${POSTNL}   | ${TUESDAY}   | ${[0, 1, 2, 3, 4, 5, 6]} | ${false}
    ${MYPARCEL}     | ${POSTNL}   | ${WEDNESDAY} | ${[0, 1, 2, 3, 4, 5, 6]} | ${false}
    ${MYPARCEL}     | ${POSTNL}   | ${THURSDAY}  | ${[0, 1, 2, 3, 4, 5, 6]} | ${false}
    ${MYPARCEL}     | ${POSTNL}   | ${FRIDAY}    | ${[0, 1, 2, 3, 4, 5, 6]} | ${false}
    ${MYPARCEL}     | ${POSTNL}   | ${SATURDAY}  | ${[0, 1, 2, 3, 4, 5, 6]} | ${false}
    ${MYPARCEL}     | ${POSTNL}   | ${SATURDAY}  | ${[1, 2, 3, 4, 5, 6]}    | ${true} 
    ${MYPARCEL}     | ${POSTNL}   | ${SUNDAY}    | ${[0, 1, 2, 3, 4, 5, 6]} | ${true}
    ${MYPARCEL}     | ${POSTNL}   | ${SUNDAY}    | ${[1, 2, 3, 4, 5, 6]}    | ${false} 
    ${SENDMYPARCEL} | ${BPOST}    | ${MONDAY}    | ${[0, 1, 2, 3, 4, 5, 6]} | ${false}
    ${SENDMYPARCEL} | ${BPOST}    | ${TUESDAY}   | ${[0, 1, 2, 3, 4, 5, 6]} | ${false}
    ${SENDMYPARCEL} | ${BPOST}    | ${WEDNESDAY} | ${[0, 1, 2, 3, 4, 5, 6]} | ${false}
    ${SENDMYPARCEL} | ${BPOST}    | ${THURSDAY}  | ${[0, 1, 2, 3, 4, 5, 6]} | ${false}
    ${SENDMYPARCEL} | ${BPOST}    | ${FRIDAY}    | ${[0, 1, 2, 3, 4, 5, 6]} | ${true}
    ${SENDMYPARCEL} | ${BPOST}    | ${SATURDAY}  | ${[0, 1, 2, 3, 4, 5, 6]} | ${false}
    ${SENDMYPARCEL} | ${BPOST}    | ${SUNDAY}    | ${[0, 1, 2, 3, 4, 5, 6]} | ${false}
    ${SENDMYPARCEL} | ${DPD}      | ${FRIDAY}    | ${[0, 1, 2, 3, 4, 5, 6]} | ${false}
    ${SENDMYPARCEL} | ${POSTNL}   | ${FRIDAY}    | ${[0, 1, 2, 3, 4, 5, 6]} | ${false}
  `('handles extra dropoff day for $platform, $carrier on day $weekday correctly', ({
    platform,
    carrier,
    weekday,
    dropOffDays,
    expected,
  }) => {
    const date = dayjs().weekday(weekday).set('h', 10).set('m', 0).toDate();
    MockDate.set(date);

    const configBus = mockConfigBus({
      [CONFIG.KEY]: {
        [CONFIG.PLATFORM]: platform,
        [CONFIG.DROP_OFF_DAYS]: dropOffDays,
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
