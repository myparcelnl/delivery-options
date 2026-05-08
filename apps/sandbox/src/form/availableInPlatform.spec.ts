import {describe, it, expect, vi} from 'vitest';
import {ref} from 'vue';
import {CarrierSetting, type CarrierCapability, type CapabilitiesResponse} from '@myparcel-dev/do-shared';
import {availableInCarrier} from './availableInPlatform';

const createCapability = (
  carrier: string,
  deliveryTypes: string[] = [],
  options: Record<string, {requires: string[]; excludes: string[]; isSelectedByDefault: boolean; isRequired: boolean}> = {},
): CarrierCapability => ({
  carrier,
  packageTypes: [],
  deliveryTypes,
  options,
});

vi.mock('../composables', () => {
  let mockResults: CarrierCapability[] = [];

  return {
    useSandboxCapabilities: () => ({
      capabilities: ref<CapabilitiesResponse>({results: mockResults}),
      availableCarrierNames: ref(mockResults.map((c) => c.carrier.toLowerCase())),
      loading: ref(false),
      getCarrierCapability: (name: string) => {
        return mockResults.find((c) => c.carrier.toLowerCase() === name.toLowerCase());
      },
    }),
    __setMockCapabilities: (caps: CarrierCapability[]) => {
      mockResults = caps;
    },
  };
});

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
const {__setMockCapabilities} = await import('../composables') as typeof import('../composables') & {
  __setMockCapabilities: (caps: CarrierCapability[]) => void;
};

describe('availableInCarrier', () => {
  it('returns true for settings without a capability mapping', () => {
    __setMockCapabilities([createCapability('postnl')]);

    expect(availableInCarrier(`postnl.${CarrierSetting.PriceStandardDelivery}`)).toBe(true);
    expect(availableInCarrier(`postnl.${CarrierSetting.DropOffDays}`)).toBe(true);
  });

  it('returns true when capability includes the delivery type', () => {
    __setMockCapabilities([
      createCapability('postnl', ['STANDARD_DELIVERY', 'MORNING_DELIVERY']),
    ]);

    expect(availableInCarrier(`postnl.${CarrierSetting.AllowStandardDelivery}`)).toBe(true);
    expect(availableInCarrier(`postnl.${CarrierSetting.AllowMorningDelivery}`)).toBe(true);
  });

  it('returns false when capability lacks the delivery type', () => {
    __setMockCapabilities([
      createCapability('postnl', ['STANDARD_DELIVERY']),
    ]);

    expect(availableInCarrier(`postnl.${CarrierSetting.AllowMorningDelivery}`)).toBe(false);
    expect(availableInCarrier(`postnl.${CarrierSetting.AllowEveningDelivery}`)).toBe(false);
  });

  it('returns true when capability includes the option', () => {
    __setMockCapabilities([
      createCapability('postnl', [], {
        requiresSignature: {requires: [], excludes: [], isSelectedByDefault: false, isRequired: false},
      }),
    ]);

    expect(availableInCarrier(`postnl.${CarrierSetting.AllowSignature}`)).toBe(true);
  });

  it('returns false when capability lacks the option', () => {
    __setMockCapabilities([
      createCapability('postnl', [], {}),
    ]);

    expect(availableInCarrier(`postnl.${CarrierSetting.AllowSignature}`)).toBe(false);
  });

  it('returns true when no capability data is available for the carrier', () => {
    __setMockCapabilities([]);

    expect(availableInCarrier(`unknown.${CarrierSetting.AllowStandardDelivery}`)).toBe(true);
  });
});
