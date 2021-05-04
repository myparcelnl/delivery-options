import * as CARRIERS from '@/data/keys/carrierKeys';
import * as CONFIG from '@/data/keys/configKeys';
import * as PLATFORMS from '@/data/keys/platformKeys';
import { UPDATED_DELIVERY_OPTIONS } from '@/config/eventConfig';
import { mockDeliveryOptions } from '@Tests/unit/delivery-options/mockDeliveryOptions';
import { waitForEvent } from '@Tests/waitForEvent';

describe('carriers', () => {
  it('shows one carrier', async() => {
    expect.assertions(4);
    const app = await mockDeliveryOptions({
      [CONFIG.KEY]: {
        [CONFIG.PLATFORM]: PLATFORMS.MYPARCEL,
        [CONFIG.CARRIER_SETTINGS]: {
          [CARRIERS.RED_JE_PAKKETJE]: {
            [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
          },
        },
      },
    });

    await waitForEvent(UPDATED_DELIVERY_OPTIONS);
    const redJePakketje = app.findChoice('carrier', CARRIERS.RED_JE_PAKKETJE);
    expect(app.findChoice('carrier', CARRIERS.POSTNL).exists()).toBe(false);
    expect(redJePakketje.exists()).toBe(true);
    expect(app.findChoice('carrier', CARRIERS.DHL).exists()).toBe(false);

    // Single carriers don't show a carrier logo.
    expect(redJePakketje.find('[data-test-id="image"]').exists()).toBe(false);
  });

  it('can show multiple carriers', async() => {
    expect.assertions(5);
    const app = await mockDeliveryOptions({
      [CONFIG.KEY]: {
        [CONFIG.PLATFORM]: PLATFORMS.MYPARCEL,
        [CONFIG.CARRIER_SETTINGS]: {
          [CARRIERS.RED_JE_PAKKETJE]: {
            [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
          },
          [CARRIERS.POSTNL]: {
            [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
          },
        },
      },
    });

    await waitForEvent(UPDATED_DELIVERY_OPTIONS);
    const postNl = app.findChoice('carrier', CARRIERS.POSTNL);
    const redJePakketje = app.findChoice('carrier', CARRIERS.RED_JE_PAKKETJE);
    const dhl = app.findChoice('carrier', CARRIERS.DHL);

    expect(postNl.exists()).toBe(true);
    expect(redJePakketje.exists()).toBe(true);
    expect(dhl.exists()).toBe(false);

    expect(postNl.find('[data-test-id="image"]').exists()).toBe(true);
    expect(redJePakketje.find('[data-test-id="image"]').exists()).toBe(true);
  });
});
