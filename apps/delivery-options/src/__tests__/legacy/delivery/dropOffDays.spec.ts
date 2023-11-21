import {afterEach, describe, expect, test} from 'vitest';
import dayjs from 'dayjs';
import {CONFIG, FRIDAY, KEY_CONFIG, MONDAY, SATURDAY, SUNDAY, THURSDAY, TUESDAY, WEDNESDAY} from '@myparcel-do/shared';
import {CarrierName, PlatformName} from '@myparcel/constants';
import {getExtraDropOffDay} from '../../../legacy/data';

describe.skip('Delivery moments', () => {
  afterEach(() => {
    vi.setSystemTime(vi.getRealSystemTime());
  });

  test.each`
    platform                     | carrier               | weekday      | expected
    ${PlatformName.MyParcel}     | ${CarrierName.PostNl} | ${MONDAY}    | ${false}
    ${PlatformName.MyParcel}     | ${CarrierName.PostNl} | ${TUESDAY}   | ${false}
    ${PlatformName.MyParcel}     | ${CarrierName.PostNl} | ${WEDNESDAY} | ${false}
    ${PlatformName.MyParcel}     | ${CarrierName.PostNl} | ${THURSDAY}  | ${false}
    ${PlatformName.MyParcel}     | ${CarrierName.PostNl} | ${FRIDAY}    | ${false}
    ${PlatformName.MyParcel}     | ${CarrierName.PostNl} | ${SATURDAY}  | ${true}
    ${PlatformName.MyParcel}     | ${CarrierName.PostNl} | ${SUNDAY}    | ${false}
    ${PlatformName.SendMyParcel} | ${CarrierName.Bpost}  | ${MONDAY}    | ${false}
    ${PlatformName.SendMyParcel} | ${CarrierName.Bpost}  | ${TUESDAY}   | ${false}
    ${PlatformName.SendMyParcel} | ${CarrierName.Bpost}  | ${WEDNESDAY} | ${false}
    ${PlatformName.SendMyParcel} | ${CarrierName.Bpost}  | ${THURSDAY}  | ${false}
    ${PlatformName.SendMyParcel} | ${CarrierName.Bpost}  | ${FRIDAY}    | ${true}
    ${PlatformName.SendMyParcel} | ${CarrierName.Bpost}  | ${SATURDAY}  | ${false}
    ${PlatformName.SendMyParcel} | ${CarrierName.Bpost}  | ${SUNDAY}    | ${false}
    ${PlatformName.SendMyParcel} | ${CarrierName.Dpd}    | ${FRIDAY}    | ${false}
    ${PlatformName.SendMyParcel} | ${CarrierName.PostNl} | ${FRIDAY}    | ${false}
  `(
    'handles extra dropoff day for $platform, $carrier on day $weekday correctly',
    ({platform, carrier, weekday, expected}) => {
      const date = dayjs().weekday(weekday).set('h', 10).set('m', 0).toDate();
      vi.setSystemTime(date);

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
