import * as CONFIG from '@/data/keys/configKeys';
import * as FORM from '@/config/formConfig';
import { INSTABOX, POSTNL } from '@/data/keys/carrierKeys';
import { MYPARCEL } from '@/data/keys/platformKeys';
import MockDate from 'mockdate';
import { TUESDAY } from '@/config/extraDeliveryConfig';
import { UPDATED_DELIVERY_OPTIONS } from '@/config/eventConfig';
import { dayjs } from '@Tests/dayjs';
import { mockDeliveryOptions } from '@Tests/unit/delivery-options/mockDeliveryOptions';
import { waitForEvent } from '@Tests/waitForEvent';

/**
 * @param {dayjs.Dayjs} date
 * @param {Partial<MyParcelDeliveryOptions.Config>} config
 * @returns {Promise<Object[]>}
 */
async function getDeliveryMoments(date, config) {
  MockDate.set(date.toDate());

  const wrapper = mockDeliveryOptions({
    [CONFIG.KEY]: {
      [CONFIG.PLATFORM]: MYPARCEL,
      ...config,
    },
  });
  await waitForEvent(UPDATED_DELIVERY_OPTIONS);

  const deliveryMomentsWrappers = wrapper.findAll('[data-test-id="deliveryMoment"]');
  return deliveryMomentsWrappers.wrappers.map((wrapper) => {
    return wrapper.element.getAttribute('data-test-choice');
  });
}

describe('Delivery moments', () => {
  afterEach(() => {
    MockDate.reset();
  });

  it.each`
    allowMorning | allowEvening
    ${true}      | ${true}
    ${false}     | ${false}
    ${true}      | ${false}
    ${false}     | ${true}
  `('shows delivery moments in the right order with morning "$allowMorning" and evening "$allowEvening"',
    async({ allowMorning, allowEvening }) => {
      expect.assertions(1);
      const date = dayjs().weekday(TUESDAY).set('h', 10).set('m', 0);
      const deliveryMoments = await getDeliveryMoments(date, {
        [CONFIG.DROP_OFF_DAYS]: [0, 1, 2, 3, 4, 5, 6],
        [CONFIG.CARRIER_SETTINGS]: {
          [POSTNL]: {
            [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
            [CONFIG.ALLOW_MORNING_DELIVERY]: allowMorning,
            [CONFIG.ALLOW_EVENING_DELIVERY]: allowEvening,
          },
        },
      });

      expect(deliveryMoments).toEqual([
        ...allowMorning ? [FORM.DELIVERY_MORNING] : [],
        FORM.DELIVERY_STANDARD,
        ...allowEvening ? [FORM.DELIVERY_EVENING] : [],
      ]);
    });

  it('distinguishes between regular and same day delivery', async() => {
    expect.assertions(2);
    const config = {
      [CONFIG.CARRIER_SETTINGS]: {
        [INSTABOX]: {
          [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
          [CONFIG.ALLOW_SAME_DAY_DELIVERY]: true,
        },
      },
    };

    // Before cutoff time (which defaults to 9:30am)
    const date = dayjs().weekday(TUESDAY).set('h', 9).set('m', 0);
    expect(await getDeliveryMoments(date, config)).toEqual([FORM.DELIVERY_SAME_DAY]);

    // Past cutoff time
    expect(await getDeliveryMoments(date.set('h', 20), config)).toEqual([FORM.DELIVERY_STANDARD]);
  });
});