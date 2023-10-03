import { ERROR } from '@/config/eventConfig';
import { ERROR_INVALID_COUNTRY_CODE, ERROR_WADDEN_ISLANDS } from '@/config/errorConfig';
import { MYPARCEL } from '@/data/keys/platformKeys';
import { configBus } from '@/delivery-options/config/configBus';
import { fakeDeliveryOptionsResponse } from '../../mocks/fakeDeliveryOptionsResponse';
import { mockDeliveryOptions } from '@Tests/unit/delivery-options/mockDeliveryOptions';
import { waitForEvent } from '@Tests/waitForEvent';

describe('Error handling', () => {
  let app;

  it('should hide itself when fatal errors are returned from an endpoint', async() => {
    fakeDeliveryOptionsResponse.mockImplementation(() => {
      throw {
        errors: [
          {
            code: ERROR_INVALID_COUNTRY_CODE,
          },
        ],
      };
    });

    app = mockDeliveryOptions(MYPARCEL);
    const hideSelfSpy = jest.spyOn(app.vm, 'hideSelf');
    await waitForEvent(ERROR, configBus);

    expect(hideSelfSpy).toBeCalled();
  });

  it('should hide itself when any other unexpected error occurs', async() => {
    fakeDeliveryOptionsResponse.mockImplementation(() => {
      throw new Error();
    });

    app = mockDeliveryOptions(MYPARCEL);
    const hideSelfSpy = jest.spyOn(app.vm, 'hideSelf');
    await waitForEvent(ERROR, configBus);

    expect(hideSelfSpy).toBeCalled();
  });

  it('should do nothing when a postal code from the wadden islands throws an error', async() => {
    fakeDeliveryOptionsResponse.mockImplementation(() => {
      throw {
        errors: [
          {
            code: ERROR_WADDEN_ISLANDS,
          },
        ],
      };
    });

    app = mockDeliveryOptions(MYPARCEL);
    const hideSelfSpy = jest.spyOn(app.vm, 'hideSelf');
    const showAddressErrors = jest.spyOn(app.vm, 'showAddressErrors');
    await waitForEvent(ERROR, configBus);

    expect(showAddressErrors).not.toBeCalled();
    expect(hideSelfSpy).not.toBeCalled();
  });
});
