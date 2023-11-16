import {describe, expect, it, vi} from 'vitest';
import {ERROR, ERROR_INVALID_COUNTRY_CODE, ERROR_WADDEN_ISLANDS} from '@myparcel-do/shared';
import {PlatformName} from '@myparcel/constants';
import {mockDeliveryOptions} from './mockDeliveryOptions';

describe.skip('Error handling', () => {
  let app;

  it('should hide itself when fatal errors are returned from an endpoint', async () => {
    fakeDeliveryOptionsResponse.mockImplementation(() => {
      throw {
        errors: [
          {
            code: ERROR_INVALID_COUNTRY_CODE,
          },
        ],
      };
    });

    app = mockDeliveryOptions(PlatformName.MyParcel);
    const hideSelfSpy = vi.spyOn(app.vm, 'hideSelf');
    await waitForEvent(ERROR, configBus);

    expect(hideSelfSpy).toBeCalled();
  });

  it('should hide itself when any other unexpected error occurs', async () => {
    fakeDeliveryOptionsResponse.mockImplementation(() => {
      throw new Error();
    });

    app = mockDeliveryOptions(PlatformName.MyParcel);
    const hideSelfSpy = vi.spyOn(app.vm, 'hideSelf');
    await waitForEvent(ERROR, configBus);

    expect(hideSelfSpy).toBeCalled();
  });

  it('should do nothing when a postal code from the wadden islands throws an error', async () => {
    fakeDeliveryOptionsResponse.mockImplementation(() => {
      throw {
        errors: [
          {
            code: ERROR_WADDEN_ISLANDS,
          },
        ],
      };
    });

    app = mockDeliveryOptions(PlatformName.MyParcel);
    const hideSelfSpy = vi.spyOn(app.vm, 'hideSelf');
    const showAddressErrors = vi.spyOn(app.vm, 'showAddressErrors');
    await waitForEvent(ERROR, configBus);

    expect(showAddressErrors).not.toBeCalled();
    expect(hideSelfSpy).not.toBeCalled();
  });
});
