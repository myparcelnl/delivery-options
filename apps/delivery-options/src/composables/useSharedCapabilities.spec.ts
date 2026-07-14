import {describe, it, expect, beforeEach, vi} from 'vitest';
import {flushPromises} from '@vue/test-utils';
import {AddressField, ConfigSetting, KEY_ADDRESS, KEY_CONFIG} from '@myparcel-dev/do-shared';
import {useAddressStore, useConfigStore} from '../stores';
import {mockDeliveryOptionsConfig} from '../__tests__';
import {resetSharedCapabilities, useSharedCapabilities} from './useSharedCapabilities';

interface CapabilitiesRequestBody {
  recipient: {
    countryCode: string;
    isBusiness?: boolean;
  };
}

/**
 * Read the recipient of the capabilities request that was actually sent. `global.fetch` is
 * stubbed in the shared vitest setup, so its last call holds the serialized request body.
 */
const getLastRequestRecipient = (): CapabilitiesRequestBody['recipient'] => {
  const {calls} = vi.mocked(fetch).mock;
  const lastCall = calls.at(-1);

  expect(lastCall).toBeDefined();

  const [, options] = lastCall ?? [];
  const body = JSON.parse(String(options?.body)) as CapabilitiesRequestBody;

  return body.recipient;
};

const configureWidget = (isBusiness?: boolean): void => {
  mockDeliveryOptionsConfig({
    [KEY_ADDRESS]: {
      [AddressField.Country]: 'NL',
    },
    [KEY_CONFIG]: isBusiness === undefined ? {} : {[ConfigSetting.IsBusiness]: isBusiness},
  });
};

describe('useSharedCapabilities', () => {
  beforeEach(() => {
    resetSharedCapabilities();
    useConfigStore().reset();
    useAddressStore().reset();
  });

  it('forwards isBusiness=true onto the capabilities recipient for a business shipment', async () => {
    configureWidget(true);

    useSharedCapabilities();
    await flushPromises();

    expect(getLastRequestRecipient().isBusiness).toBe(true);
  });

  it('forwards isBusiness=false onto the capabilities recipient for a consumer shipment', async () => {
    configureWidget(false);

    useSharedCapabilities();
    await flushPromises();

    expect(getLastRequestRecipient().isBusiness).toBe(false);
  });

  it('omits isBusiness when the platform does not provide it, so older hosts keep working', async () => {
    configureWidget(undefined);

    useSharedCapabilities();
    await flushPromises();

    const recipient = getLastRequestRecipient();

    expect(recipient.countryCode).toBe('NL');
    expect(recipient).not.toHaveProperty('isBusiness');
  });
});
