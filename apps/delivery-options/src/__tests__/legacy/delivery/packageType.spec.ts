import {describe, expect, it} from 'vitest';
import {
  CONFIG,
  KEY_CONFIG,
  PACKAGE_TYPE_DIGITAL_STAMP,
  PACKAGE_TYPE_MAILBOX,
  PACKAGE_TYPE_PACKAGE,
  UPDATED_DELIVERY_OPTIONS,
} from '@myparcel-do/shared';
import {mockDeliveryOptions} from '../mockDeliveryOptions';

describe.skip('package type', () => {
  it.each`
    packageType
    ${PACKAGE_TYPE_PACKAGE}
    ${PACKAGE_TYPE_MAILBOX}
    ${PACKAGE_TYPE_DIGITAL_STAMP}
  `('can use $packageType', async ({packageType}) => {
    expect.assertions(1);

    mockDeliveryOptions({
      [KEY_CONFIG]: {
        [CONFIG.PACKAGE_TYPE]: packageType,
      },
    });

    const event = await waitForEvent(UPDATED_DELIVERY_OPTIONS);

    expect(event.detail.packageType).toEqual(packageType);
  });
});
