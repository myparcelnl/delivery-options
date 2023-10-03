/* eslint-disable max-len,vue/max-len */
import { MYPARCEL, SENDMYPARCEL } from '@/data/keys/platformKeys';
import MockDate from 'mockdate';
import { getNextDeliveryOption } from '../../mocks/delivery-options/getNextDeliveryOption';

const tuesday = '2020-03-10';
const thursday = '2020-03-12';
const friday = '2020-03-13';
const saturday = '2020-03-14';

const monday2 = '2020-03-16';
const tuesday2 = '2020-03-17';

describe('Mocking delivery options request', () => {
  it.each`
  day         | result      | dropOffDelay | cutoff_time | deliverydays_window | dropoff_days     | monday_delivery
  ${friday}   | ${saturday} | ${0}         | ${'12:30'}  | ${7}                | ${'1;2;3;4;5;6'} | ${0}
  ${saturday} | ${monday2}  | ${0}         | ${'14:30'}  | ${7}                | ${'1;2;3;4;5;6'} | ${1}
  ${saturday} | ${tuesday2} | ${0}         | ${'00:01'}  | ${7}                | ${'1;2;3;4;5;6'} | ${0}
  ${tuesday}  | ${thursday} | ${1}         | ${'09:30'}  | ${7}                | ${'1;2;3;4;5;6'} | ${0}
  `('MyParcel: the next delivery date for $day is $result',
    ({
      day,
      result,
      dropOffDelay,
      ...args
    }) => {
      MockDate.set(`${day}T10:00:00`);
      const deliveryOption = getNextDeliveryOption({
        ...args,
        platform: MYPARCEL,
      }, dropOffDelay + 1);
      const date = deliveryOption.data.date.date.replace(' 00:00:00.000000', '');
      expect(date).toMatch(result);
    });

  it.each`
  day         | result      | dropOffDelay | cutoff_time | deliverydays_window | dropoff_days     | saturday_delivery
  ${friday}   | ${saturday} | ${0}         | ${'12:30'}  | ${7}                | ${'1;2;3;4;5;6'} | ${1}
  ${saturday} | ${monday2}  | ${0}         | ${'14:30'}  | ${7}                | ${'0;1;2;3'}     | ${0}
  ${tuesday}  | ${thursday} | ${1}         | ${'09:30'}  | ${7}                | ${'1;2;3;4;5;6'} | ${0}
  `('SendMyParcel: the next delivery date for $day is $result',
    ({
      day,
      result,
      dropOffDelay,
      ...args
    }) => {
      MockDate.set(`${day}T10:00:00`);
      const deliveryOption = getNextDeliveryOption({
        ...args,
        platform: SENDMYPARCEL,
      }, dropOffDelay + 1);
      const date = deliveryOption.data.date.date.replace(' 00:00:00.000000', '');
      expect(date).toMatch(result);
    });
});
