import {
  ACCEPT_JSON,
  ENDPOINT_CARRIERS,
  HEADER_ACCEPT,
  HEADER_ACCEPT_LANGUAGE,
  HEADER_USER_AGENT,
  endpointCarriers,
  endpointDeliveryOptions,
  endpointPickupLocations,
} from '@/delivery-options/data/endpoints';
import { CarrierConfigurationFactory } from '@/data/carriers/carrierConfigurationFactory';
import MockDate from 'mockdate';
import { fetchCarrierData } from '@/delivery-options/data/carriers/fetchCarrierData';
import { fetchDeliveryOptions } from '@/delivery-options/data/delivery/fetchDeliveryOptions';
import { fetchFromEndpoint } from '@/delivery-options/data/request/fetchFromEndpoint';
import { fetchPickupLocations } from '@/delivery-options/data/pickup/fetchPickupLocations';
import { mockConfigBus } from './mockConfigBus';

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
    async(definition) => {
      expect.assertions(1);

      await fetchFromEndpoint(definition,
        {
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
    it('creates request', async() => {
      expect.assertions(2);

      const response = await fetchCarrierData('bpost');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api/carriers/bpost',
        expect.objectContaining(commonOptions),
      );

      expect(response).toEqual(expect.any(Array));
    });
  });

  describe('delivery options', () => {
    it('creates request', async() => {
      expect.assertions(2);

      const response = await fetchDeliveryOptions('bpost');

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
    it('creates request', async() => {
      expect.assertions(2);

      const response = await fetchPickupLocations(CarrierConfigurationFactory.create('bpost'));

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/^https:\/\/api\/pickup_locations\?[&=\w]*carrier=bpost/),
        expect.objectContaining(commonOptions),
      );

      expect(response).toEqual(expect.any(Array));
    });
  });
});
