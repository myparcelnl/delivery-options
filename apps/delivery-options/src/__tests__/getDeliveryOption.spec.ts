/* eslint-disable max-len,vue/max-len */
import {afterEach, describe, expect, it, vi} from 'vitest';
import {format} from 'date-fns';
import {
  type MockDeliveryOptionsParameters,
  type ResolvedMockDeliveryOptionsParameters,
} from '@myparcel-do/shared/testing';
import {CUTOFF_TIME_DEFAULT, getFullCarrier, type SupportedPlatformName} from '@myparcel-do/shared';
import {CarrierName, PlatformName} from '@myparcel/constants';
import {getNextDeliveryOption} from './mocks';

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
  platform: SupportedPlatformName;
  result: keyof typeof DATES;
}

describe('Mocking delivery options requests', () => {
  afterEach(() => {
    vi.setSystemTime(vi.getRealSystemTime());
    getFullCarrier.clear();
  });

  it.each`
    platform                     | day      | result       | args
    ${PlatformName.MyParcel}     | ${'fri'} | ${'sat'}     | ${{}}
    ${PlatformName.MyParcel}     | ${'sat'} | ${'nextMon'} | ${{mondayDelivery: true}}
    ${PlatformName.MyParcel}     | ${'sat'} | ${'nextTue'} | ${{}}
    ${PlatformName.MyParcel}     | ${'tue'} | ${'thu'}     | ${{cutoffTime: '09:30', dropOffDelay: 1}}
    ${PlatformName.SendMyParcel} | ${'fri'} | ${'sat'}     | ${{saturdayDelivery: true}}
    ${PlatformName.SendMyParcel} | ${'fri'} | ${'nextMon'} | ${{}}
    ${PlatformName.SendMyParcel} | ${'sat'} | ${'nextMon'} | ${{dropOffDays: [0, 1, 2, 3]}}
    ${PlatformName.SendMyParcel} | ${'tue'} | ${'thu'}     | ${{cutoffTime: '09:30', dropOffDelay: 1}}
  `(
    'first delivery for $day is on $result with args ($platform, $args)',
    async ({platform, day, result, args}: TestInput) => {
      expect.assertions(1);

      vi.setSystemTime(`${DATES[day]}T10:00:00`);

      const resolvedArgs = {
        platform,
        carrier: platform === PlatformName.MyParcel ? CarrierName.PostNl : CarrierName.Bpost,
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
    },
  );
});
