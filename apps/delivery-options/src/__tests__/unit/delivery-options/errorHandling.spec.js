import { ERROR } from '../../../config';
import { ERROR_INVALID_COUNTRY_CODE } from '../../../config';
import { MYPARCEL } from '../../../data/keys/platformKeys';
import { configBus } from '../../../config';
import { fakeDeliveryOptionsResponse } from '../../../__mocks__/@myparcel/js-sdk/dist/data/fakeDeliveryOptionsResponse';
import { mockDeliveryOptions } from './mockDeliveryOptions';
import { waitForEvent } from '../../waitForEvent';

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
});
