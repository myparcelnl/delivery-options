import {describe, it, expect, beforeEach, vi} from 'vitest';
import {flushPromises} from '@vue/test-utils';
import {
  mockCapabilitiesFetch,
  WEIGHT_MAX,
  WEIGHT_MIN,
  WEIGHT_TOO_HEAVY,
  WEIGHT_UNDERWEIGHT,
} from '@myparcel-dev/do-shared/testing';
import {
  AddressField,
  ConfigSetting,
  KEY_ADDRESS,
  KEY_CONFIG,
  type CapabilitiesRequest,
  type InputDeliveryOptionsConfiguration,
} from '@myparcel-dev/do-shared';
import {CarrierName} from '@myparcel-dev/constants';
import {getResolvedCarrier} from '../utils';
import {useAddressStore, useConfigStore} from '../stores';
import {setConfiguration} from '../config';
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
    mockCapabilitiesFetch.mockReset();
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

  it.each(['NL', 'BE'])('updates pickup through the existing capabilities response in %s', async (countryCode) => {
    mockCapabilitiesFetch.mockImplementation((url, options) => {
      const request = JSON.parse(String(options?.body)) as CapabilitiesRequest;
      const value = request.physicalProperties?.weight?.value;
      const deliveryTypes =
        value !== undefined && value > WEIGHT_MAX ? ['STANDARD_DELIVERY'] : ['STANDARD_DELIVERY', 'PICKUP_DELIVERY'];
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            results: [{carrier: 'DPD', packageTypes: ['PACKAGE'], deliveryTypes, options: {}}],
          }),
      } as Response);
    });
    const config: InputDeliveryOptionsConfiguration = {
      address: {cc: countryCode},
      config: {
        proxyCapabilities: 'https://example.test/capabilities',
        carrierSettings: {dpd: {allowPickupLocations: true, allowStandardDelivery: true}},
      },
    };
    const updateWeight = (value: number | null | undefined) =>
      setConfiguration({
        ...config,
        config: {
          ...config.config,
          ...(value === undefined ? {} : {physicalProperties: value === null ? null : {weight: value}}),
        },
      });
    updateWeight(undefined);
    const carrier = getResolvedCarrier(CarrierName.Dpd);
    await flushPromises();
    const legacyBody = JSON.parse(String(mockCapabilitiesFetch.mock.lastCall?.[1]?.body));
    expect(legacyBody).not.toHaveProperty('physicalProperties');
    expect(carrier.hasPickup.value).toBe(true);

    for (const value of [WEIGHT_MAX, WEIGHT_TOO_HEAVY, WEIGHT_UNDERWEIGHT]) {
      updateWeight(value);
      await flushPromises();
      expect(carrier.hasPickup.value).toBe(value <= WEIGHT_MAX);
      expect(carrier.hasDelivery.value).toBe(true);
      expect(JSON.parse(String(mockCapabilitiesFetch.mock.lastCall?.[1]?.body))).toEqual({
        ...legacyBody,
        physicalProperties: {weight: {value, unit: 'g'}},
      });
      expect(useConfigStore().state.carrierSettings.dpd?.allowPickupLocations).toBe(true);
    }

    updateWeight(WEIGHT_UNDERWEIGHT);
    await flushPromises();
    expect(mockCapabilitiesFetch).toHaveBeenCalledTimes(4);
    updateWeight(null);
    await flushPromises();
    expect(JSON.parse(String(mockCapabilitiesFetch.mock.lastCall?.[1]?.body))).toEqual(legacyBody);
    updateWeight(WEIGHT_TOO_HEAVY);
    await flushPromises();
    updateWeight(undefined);
    await flushPromises();
    expect(useConfigStore().state.physicalProperties).toBeNull();
    expect(JSON.parse(String(mockCapabilitiesFetch.mock.lastCall?.[1]?.body))).toEqual(legacyBody);
    expect(carrier.hasPickup.value).toBe(true);
  });

  it('keeps pickup disabled by the merchant, including for a real one-gram shipment', async () => {
    mockDeliveryOptionsConfig({
      config: {
        physicalProperties: {weight: WEIGHT_MIN},
        carrierSettings: {dpd: {allowPickupLocations: false, allowStandardDelivery: true}},
      },
    });
    const carrier = getResolvedCarrier(CarrierName.Dpd);
    await flushPromises();
    expect(carrier.hasPickup.value).toBe(false);
    expect(carrier.hasDelivery.value).toBe(true);
    expect(JSON.parse(String(mockCapabilitiesFetch.mock.lastCall?.[1]?.body)).physicalProperties).toEqual({
      weight: {value: WEIGHT_MIN, unit: 'g'},
    });
  });

  it('clears a previous weight when an invalid weight is supplied in the next configuration', async () => {
    const config = {
      address: {cc: 'NL'},
      config: {
        proxyCapabilities: 'https://example.test/capabilities',
        carrierSettings: {dpd: {allowPickupLocations: true}},
      },
    };
    setConfiguration({...config, config: {...config.config, physicalProperties: {weight: WEIGHT_TOO_HEAVY}}});
    useSharedCapabilities();
    await flushPromises();
    setConfiguration({...config, config: {...config.config, physicalProperties: {weight: 0}}});
    await flushPromises();
    expect(useConfigStore().state.physicalProperties).toBeNull();
    expect(JSON.parse(String(mockCapabilitiesFetch.mock.lastCall?.[1]?.body))).not.toHaveProperty('physicalProperties');
  });
});
