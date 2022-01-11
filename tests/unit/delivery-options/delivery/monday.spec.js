import * as CONFIG from '@/data/keys/configKeys';
import { DATE_SATURDAY, DATE_SATURDAY_AFTER_CUTOFF, configMyParcel } from '@Tests/unit/delivery-options/delivery/data';
import { FRIDAY, MONDAY, SATURDAY, THURSDAY, TUESDAY, WEDNESDAY } from '@/config/extraDeliveryConfig';
import MockDate from 'mockdate';
import { getMockedDeliveryDateChoices } from '@Tests/helpers/getMockedDeliveryDateChoices';

describe('monday delivery', () => {
  afterEach(() => {
    MockDate.reset();
  });

  test('can show monday delivery', async() => {
    expect.assertions(1);
    MockDate.set(DATE_SATURDAY);

    const choices = await getMockedDeliveryDateChoices(configMyParcel);

    // Monday to Saturday and the Monday after
    expect(choices).toStrictEqual([
      '2020-03-16T00:00:00.000Z',
      '2020-03-17T00:00:00.000Z',
      '2020-03-18T00:00:00.000Z',
      '2020-03-19T00:00:00.000Z',
      '2020-03-20T00:00:00.000Z',
      '2020-03-21T00:00:00.000Z',
      // Sunday: disallowed
      '2020-03-23T00:00:00.000Z',
    ]);
  });

  it('does not show monday delivery when "allow_monday_delivery" is false', async() => {
    expect.assertions(1);
    MockDate.set(DATE_SATURDAY);

    const choices = await getMockedDeliveryDateChoices({
      ...configMyParcel,
      [CONFIG.ALLOW_MONDAY_DELIVERY]: false,
    });

    // Tuesday to Saturday and the next Tuesday and Wednesday
    expect(choices).toStrictEqual([
      '2020-03-17T00:00:00.000Z',
      '2020-03-18T00:00:00.000Z',
      '2020-03-19T00:00:00.000Z',
      '2020-03-20T00:00:00.000Z',
      '2020-03-21T00:00:00.000Z',
      // Sunday: disallowed
      // Monday: disallowed
      '2020-03-24T00:00:00.000Z',
      '2020-03-25T00:00:00.000Z',
    ]);
  });

  it('does not show monday delivery when saturday is not a drop-off day', async() => {
    expect.assertions(1);
    MockDate.set(DATE_SATURDAY);

    const choicesWithMissingDropOffDay = await getMockedDeliveryDateChoices({
      ...configMyParcel,
      // No Saturday.
      [CONFIG.DROP_OFF_DAYS]: [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY],
    });

    // Tuesday to Saturday and the next Tuesday and Wednesday
    expect(choicesWithMissingDropOffDay).toStrictEqual([
      '2020-03-17T00:00:00.000Z',
      '2020-03-18T00:00:00.000Z',
      '2020-03-19T00:00:00.000Z',
      '2020-03-20T00:00:00.000Z',
      '2020-03-21T00:00:00.000Z',
      // Sunday: disallowed
      // Monday: disallowed
      '2020-03-24T00:00:00.000Z',
      '2020-03-25T00:00:00.000Z',
    ]);
  });

  it('does not show monday delivery when the saturday cutoff time has passed', async() => {
    expect.assertions(1);
    MockDate.set(DATE_SATURDAY_AFTER_CUTOFF);

    const choices = await getMockedDeliveryDateChoices({
      ...configMyParcel,
      // No Sunday.
      [CONFIG.DROP_OFF_DAYS]: [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY],
    });

    expect(choices).toStrictEqual([
      // Monday: disallowed because Saturday cutoff time has passed
      '2020-03-17T00:00:00.000Z',
      '2020-03-18T00:00:00.000Z',
      '2020-03-19T00:00:00.000Z',
      '2020-03-20T00:00:00.000Z',
      '2020-03-21T00:00:00.000Z',
      // Sunday: disallowed
      '2020-03-23T00:00:00.000Z',
      '2020-03-24T00:00:00.000Z',
    ]);
  });
});
