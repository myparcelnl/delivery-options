/* eslint-disable max-len,vue/max-len */
import {afterEach, describe, expect, it, vi} from 'vitest';
import {format} from 'date-fns';
import {CarrierName} from '@myparcel-dev/constants';
import {type MockDeliveryOptionsParameters, type ResolvedMockDeliveryOptionsParameters} from '../../types';
import {CUTOFF_TIME_DEFAULT} from '../../../data';
import {getNextDeliveryOption} from './getNextDeliveryOption';

const DATES = Object.freeze({
  tue: '2020-03-10',
  wed: '2020-03-11',
  thu: '2020-03-12',
  fri: '2020-03-13',
  sat: '2020-03-14',
  sun: '2020-03-15',
  nextMon: '2020-03-16',
  nextTue: '2020-03-17',
});

interface TestInput {
  args: Partial<MockDeliveryOptionsParameters>;
  carrier: CarrierName;
  day: keyof typeof DATES;
  result: keyof typeof DATES;
}

describe.skip('Mocking delivery options requests', () => {
  afterEach(() => {
    vi.setSystemTime(vi.getRealSystemTime());
  });

  it.each`
    day      | result       | args
    ${'fri'} | ${'sat'}     | ${{}}
    ${'sat'} | ${'nextMon'} | ${{mondayDelivery: true}}
    ${'sat'} | ${'nextTue'} | ${{}}
    ${'tue'} | ${'thu'}     | ${{cutoffTime: '09:30', dropOffDelay: 1}}
  `('first delivery for $day is on $result with args ($args)', async ({day, result, args}: TestInput) => {
    expect.assertions(1);

    vi.setSystemTime(`${DATES[day]}T10:00:00`);

    const resolvedArgs = {
      carrier: CarrierName.PostNl,
      cutoffTime: CUTOFF_TIME_DEFAULT,
      deliveryDaysWindow: 7,
      dropOffDays: [1, 2, 3, 4, 5, 6],
      dropOffDelay: 0,
      mondayDelivery: false,
      saturdayDelivery: false,
      ...args,
    } satisfies ResolvedMockDeliveryOptionsParameters;

    const deliveryOption = await getNextDeliveryOption(resolvedArgs, resolvedArgs.dropOffDelay + 1);

    expect(format(new Date(deliveryOption.data.date.date), 'yyyy-MM-dd')).toEqual(DATES[result]);
  });
});
