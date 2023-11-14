import {afterEach, beforeAll, describe, expect, it} from 'vitest';
import {getCarrierConfiguration} from '@myparcel-do/shared';
import {CarrierName} from '@myparcel/constants';
import {
  ACCEPT_JSON,
  ENDPOINT_CARRIERS,
  endpointCarriers,
  endpointDeliveryOptions,
  endpointPickupLocations,
  fetchCarrierData,
  fetchDeliveryOptions,
  fetchFromEndpoint,
  fetchPickupLocations,
  HEADER_ACCEPT,
  HEADER_ACCEPT_LANGUAGE,
  HEADER_USER_AGENT,
} from '../../legacy/data';
import {mockConfigBus} from './mockConfigBus';

const commonOptions = {
  method: 'get',
  headers: {
    [HEADER_ACCEPT]: ACCEPT_JSON,
    [HEADER_ACCEPT_LANGUAGE]: 'nl-BE',
    [HEADER_USER_AGENT]: expect.stringMatching(/^MyParcelDeliveryOptions\/\d+\.\d+\.\d+$/),
  },
};

describe('api', () => {
  beforeAll(() => {
    mockConfigBus({
      config: {
        apiBaseUrl: 'https://api',
        locale: 'nl-BE',
      },
    });
  });

  afterEach(() => {
    global.fetch.mockClear();
    MockDate.reset();
  });

  it.each([endpointCarriers, endpointDeliveryOptions, endpointPickupLocations])(
    'creates request to %s',
    async (definition) => {
      expect.assertions(1);

      await fetchFromEndpoint(definition, {
        method: 'get',
        path: 'test',
        params: {
          paramA: 'a',
          paramB: '1',
        },
        headers: {
          'X-Test': 'test',
        },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        `https://api/${definition.endpoint}/test?paramA=a&paramB=1`,
        expect.objectContaining({
          ...commonOptions,
          headers: {
            ...commonOptions.headers,
            'X-Test': 'test',
          },
        }),
      );
    },
  );

  describe(ENDPOINT_CARRIERS, () => {
    it('creates request', async () => {
      expect.assertions(2);

      const response = await fetchCarrierData(CarrierName.Bpost);

      expect(global.fetch).toHaveBeenCalledWith('https://api/carriers/bpost', expect.objectContaining(commonOptions));

      expect(response).toEqual(expect.any(Array));
    });
  });

  describe('delivery options', () => {
    it('creates request', async () => {
      expect.assertions(2);

      const response = await fetchDeliveryOptions(CarrierName.Bpost);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/^https:\/\/api\/delivery_options\?[&=\w]*carrier=bpost/),
        expect.objectContaining({
          ...commonOptions,
          headers: {
            ...commonOptions.headers,
            [HEADER_ACCEPT]: `${ACCEPT_JSON};version=2.0`,
          },
        }),
      );

      expect(response).toEqual(expect.any(Array));
    });
  });

  describe('pickup locations', () => {
    it('creates request', async () => {
      expect.assertions(2);

      const response = await fetchPickupLocations(getCarrierConfiguration(CarrierName.Bpost));

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/^https:\/\/api\/pickup_locations\?[&=\w]*carrier=bpost/),
        expect.objectContaining(commonOptions),
      );

      expect(response).toEqual(expect.any(Array));
    });
  });
});
