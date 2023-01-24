import {CONFIG} from '../../data';
import { DATE_FRIDAY, DATE_FRIDAY_AFTER_CUTOFF, configSendMyParcel } from '@Tests/unit/delivery-options/delivery/data';
import { MONDAY, SUNDAY, TUESDAY, WEDNESDAY } from '../../config/extraDeliveryConfig';
import MockDate from 'mockdate';
import { getMockedDeliveryDateChoices } from '@Tests/helpers/getMockedDeliveryDateChoices';

describe('saturday delivery', () => {
  afterEach(() => {
    MockDate.reset();
  });

  test('can show saturday delivery', async() => {
    expect.assertions(1);
    MockDate.set(DATE_FRIDAY);

    const choicesWithMissingDropOffDay = await getMockedDeliveryDateChoices(configSendMyParcel);

    // Only Saturday
    expect(choicesWithMissingDropOffDay).toStrictEqual([
      '2020-03-14T00:00:00.000Z',
    ]);
  });

  it('does not show saturday delivery when "allow_saturday_delivery" is false', async() => {
    expect.assertions(1);
    MockDate.set(DATE_FRIDAY);

    const choices = await getMockedDeliveryDateChoices({
      ...configSendMyParcel,
      [CONFIG.ALLOW_SATURDAY_DELIVERY]: false,
    });

    // Next Monday.
    expect(choices).toStrictEqual([
      '2020-03-16T00:00:00.000Z',
    ]);
  });

  it('does not show saturday delivery when friday is not a drop-off day', async() => {
    expect.assertions(1);
    MockDate.set(DATE_FRIDAY);

    const choices = await getMockedDeliveryDateChoices({
      ...configSendMyParcel,
      [CONFIG.DROP_OFF_DAYS]: [SUNDAY, MONDAY, TUESDAY, WEDNESDAY],
    });

    // Monday because Sunday is a dropoff day.
    expect(choices).toStrictEqual([
      '2020-03-16T00:00:00.000Z',
    ]);
  });

  it('does not show saturday delivery when the friday cutoff time has passed', async() => {
    expect.assertions(1);
    MockDate.set(DATE_FRIDAY_AFTER_CUTOFF);

    const choices = await getMockedDeliveryDateChoices(configSendMyParcel);

    // Tuesday because Monday to Friday are dropoff days.
    expect(choices).toStrictEqual([
      '2020-03-17T00:00:00.000Z',
    ]);
  });
});
