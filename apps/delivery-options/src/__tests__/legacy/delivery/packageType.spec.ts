import {describe, expect, it} from 'vitest';
import {CONFIG, KEY_CONFIG, UPDATED_DELIVERY_OPTIONS} from '@myparcel-do/shared';
import {PackageTypeName} from '@myparcel/constants';
import {mockDeliveryOptions} from '../mockDeliveryOptions';

describe.skip('package type', () => {
  it.each`
    packageType
    ${PackageTypeName.Package}
    ${PackageTypeName.Mailbox}
    ${PackageTypeName.DigitalStamp}
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
