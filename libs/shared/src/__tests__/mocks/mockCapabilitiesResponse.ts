import {vi} from 'vitest';
import {type CapabilitiesResponse, type CarrierCapability} from '../../types';

const DEFAULT_OPTION = {
  requires: [] as string[],
  excludes: [] as string[],
  isSelectedByDefault: false,
  isRequired: false,
};

export const MOCK_CAPABILITIES: CarrierCapability[] = [
  {
    carrier: 'POSTNL',
    packageTypes: ['PACKAGE', 'MAILBOX', 'DIGITAL_STAMP', 'SMALL_PACKAGE'],
    deliveryTypes: ['STANDARD_DELIVERY', 'MORNING_DELIVERY', 'EVENING_DELIVERY', 'PICKUP_DELIVERY'],
    options: {
      requiresSignature: {...DEFAULT_OPTION},
      recipientOnlyDelivery: {...DEFAULT_OPTION, requires: ['requiresSignature']},
      priorityDelivery: {...DEFAULT_OPTION},
      mondayDelivery: {...DEFAULT_OPTION},
    },
    collo: {max: 10},
  },
  {
    carrier: 'DHL_FOR_YOU',
    packageTypes: ['PACKAGE', 'MAILBOX', 'SMALL_PACKAGE'],
    deliveryTypes: ['STANDARD_DELIVERY', 'EVENING_DELIVERY', 'PICKUP_DELIVERY'],
    options: {
      requiresSignature: {...DEFAULT_OPTION},
      recipientOnlyDelivery: {...DEFAULT_OPTION},
      sameDayDelivery: {...DEFAULT_OPTION},
    },
    collo: {max: 1},
  },
  {
    carrier: 'DHL_PARCEL_CONNECT',
    packageTypes: ['PACKAGE'],
    deliveryTypes: ['STANDARD_DELIVERY'],
    options: {
      requiresSignature: {...DEFAULT_OPTION},
    },
    collo: {max: 1},
  },
  {
    carrier: 'DHL_EUROPLUS',
    packageTypes: ['PACKAGE'],
    deliveryTypes: ['STANDARD_DELIVERY'],
    options: {
      requiresSignature: {...DEFAULT_OPTION, isRequired: true},
      saturdayDelivery: {...DEFAULT_OPTION},
    },
    collo: {max: 1},
  },
  {
    carrier: 'DPD',
    packageTypes: ['PACKAGE', 'MAILBOX'],
    deliveryTypes: ['STANDARD_DELIVERY', 'PICKUP_DELIVERY'],
    options: {
      saturdayDelivery: {...DEFAULT_OPTION},
    },
    collo: {max: 1},
  },
  {
    carrier: 'BPOST',
    packageTypes: ['PACKAGE'],
    deliveryTypes: ['STANDARD_DELIVERY', 'PICKUP_DELIVERY'],
    options: {
      requiresSignature: {...DEFAULT_OPTION},
    },
    collo: {max: 1},
  },
  {
    carrier: 'UPS_STANDARD',
    packageTypes: ['PACKAGE'],
    deliveryTypes: ['STANDARD_DELIVERY', 'PICKUP_DELIVERY'],
    options: {
      requiresSignature: {...DEFAULT_OPTION},
      recipientOnlyDelivery: {...DEFAULT_OPTION},
    },
    collo: {max: 20},
  },
  {
    carrier: 'UPS_EXPRESS_SAVER',
    packageTypes: ['PACKAGE'],
    deliveryTypes: ['EXPRESS_DELIVERY', 'PICKUP_DELIVERY'],
    options: {
      requiresSignature: {...DEFAULT_OPTION},
      recipientOnlyDelivery: {...DEFAULT_OPTION},
    },
    collo: {max: 20},
  },
];

export const MOCK_CAPABILITIES_RESPONSE: CapabilitiesResponse = {
  results: MOCK_CAPABILITIES,
};

/** Countries for which the mock returns capabilities data. */
const SUPPORTED_COUNTRIES = ['NL', 'BE'];

/**
 * Mock function for global.fetch that returns capabilities data.
 * Returns capabilities for supported countries, empty results for others.
 * Can be overridden per-test by changing the return value.
 */
export const mockCapabilitiesFetch = vi.fn((url: string, options?: RequestInit): Promise<Response> => {
  void url;
  const body = options?.body ? JSON.parse(options.body as string) : {};
  const countryCode = body?.recipient?.countryCode;

  const results = SUPPORTED_COUNTRIES.includes(countryCode) ? MOCK_CAPABILITIES : [];

  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({results}),
  } as Response);
});
