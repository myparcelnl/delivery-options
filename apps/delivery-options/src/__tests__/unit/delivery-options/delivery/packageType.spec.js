import {CONFIG} from '../../data';
import { PACKAGE_TYPE_DIGITAL_STAMP, PACKAGE_TYPE_MAILBOX, PACKAGE_TYPE_PACKAGE } from '../../data/keys/settingsConsts';
import { UPDATED_DELIVERY_OPTIONS } from '../../config/eventConfig';
import { mockDeliveryOptions } from '@Tests/unit/delivery-options/mockDeliveryOptions';
import { waitForEvent } from '@Tests/waitForEvent';

describe('package type', () => {
  it.each`
   packageType
   ${PACKAGE_TYPE_PACKAGE}
   ${PACKAGE_TYPE_MAILBOX}
   ${PACKAGE_TYPE_DIGITAL_STAMP}
  `('can use $packageType', async({ packageType }) => {
    expect.assertions(1);

    mockDeliveryOptions({
      [CONFIG.KEY]: {
        [CONFIG.PACKAGE_TYPE]: packageType,
      },
    });

    const event = await waitForEvent(UPDATED_DELIVERY_OPTIONS);

    expect(event.detail.packageType).toEqual(packageType);
  });
});
