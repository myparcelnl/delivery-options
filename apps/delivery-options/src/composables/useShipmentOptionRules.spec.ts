import {toValue} from 'vue';
import {describe, it, expect, beforeEach} from 'vitest';
import {flushPromises} from '@vue/test-utils';
import {mockCapabilitiesFetch} from '@myparcel-dev/do-shared/testing';
import {
  AddressField,
  CarrierSetting,
  KEY_ADDRESS,
  KEY_CARRIER_SETTINGS,
  KEY_CONFIG,
  type CarrierCapability,
  type CapabilitiesResponse,
} from '@myparcel-dev/do-shared';
import {CarrierName, ShipmentOptionName} from '@myparcel-dev/constants';
import {useAddressStore, useConfigStore} from '../stores';
import {mockDeliveryOptionsConfig} from '../__tests__';
import {useShipmentOptionRules} from './useShipmentOptionRules';
import {useSelectedValues} from './useSelectedValues';

const DEFAULT_OPTION = {
  requires: [] as string[],
  excludes: [] as string[],
  isSelectedByDefault: false,
  isRequired: false,
};

const setupWithCapabilities = async (
  carrier: CarrierName,
  capabilities?: CarrierCapability[],
  selectedOptions: string[] = [],
): Promise<ReturnType<typeof useShipmentOptionRules>> => {
  if (capabilities) {
    mockCapabilitiesFetch.mockImplementation((_url: string, options?: RequestInit) => {
      void _url;
      const body = options?.body ? JSON.parse(options.body as string) : {};
      const countryCode = body?.recipient?.countryCode || 'NL';

      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            results: countryCode === 'NL' ? capabilities : [],
          } satisfies CapabilitiesResponse),
      } as Response);
    });
  }

  mockDeliveryOptionsConfig({
    [KEY_ADDRESS]: {
      [AddressField.Country]: 'NL',
    },
    [KEY_CONFIG]: {
      [CarrierSetting.AllowSignature]: true,
      [CarrierSetting.AllowOnlyRecipient]: true,
      [CarrierSetting.AllowPriorityDelivery]: true,
      [KEY_CARRIER_SETTINGS]: {
        [carrier]: {
          [CarrierSetting.AllowStandardDelivery]: true,
        },
      },
    },
  });

  // Set delivery moment and selection BEFORE flushing so the reactive chain
  // triggers useSharedCapabilities() which kicks off the capabilities fetch.
  const {shipmentOptions} = useSelectedValues();
  shipmentOptions.value = selectedOptions;
  useSelectedValues().deliveryMoment.value = JSON.stringify({carrier});

  const rules = useShipmentOptionRules();

  // Trigger evaluation to start capabilities loading
  toValue(rules.forcedOn);
  await flushPromises();

  return rules;
};

describe('useShipmentOptionRules', () => {
  beforeEach(() => {
    useSelectedValues.clear();
    useShipmentOptionRules.clear();
    useConfigStore().reset();
    useAddressStore().reset();
    mockCapabilitiesFetch.mockRestore();
  });

  describe('forcedOn', () => {
    it('includes isRequired options', async () => {
      // DHL Europlus has requiresSignature.isRequired: true in mock data
      const {forcedOn} = await setupWithCapabilities(CarrierName.DhlEuroPlus);

      expect(toValue(forcedOn).has(ShipmentOptionName.Signature)).toBe(true);
    });

    it('includes required options when a requiring option is selected', async () => {
      // PostNL: recipientOnlyDelivery.requires: ['requiresSignature']
      const {forcedOn} = await setupWithCapabilities(
        CarrierName.PostNl,
        undefined,
        [ShipmentOptionName.OnlyRecipient],
      );

      expect(toValue(forcedOn).has(ShipmentOptionName.Signature)).toBe(true);
    });

    it('does not force options when the requiring option is not selected', async () => {
      const {forcedOn} = await setupWithCapabilities(CarrierName.PostNl);

      expect(toValue(forcedOn).has(ShipmentOptionName.Signature)).toBe(false);
    });

    it('resolves transitive requires', async () => {
      // A requires B, B requires C → selecting A forces B and C
      const {forcedOn} = await setupWithCapabilities(
        CarrierName.PostNl,
        [
          {
            carrier: 'POSTNL',
            packageTypes: ['PACKAGE'],
            deliveryTypes: ['STANDARD_DELIVERY'],
            options: {
              requiresSignature: {...DEFAULT_OPTION},
              recipientOnlyDelivery: {...DEFAULT_OPTION, requires: ['requiresSignature']},
              priorityDelivery: {...DEFAULT_OPTION, requires: ['recipientOnlyDelivery']},
            },
          },
        ],
        [ShipmentOptionName.PriorityDelivery],
      );

      const forced = toValue(forcedOn);

      expect(forced.has(ShipmentOptionName.OnlyRecipient)).toBe(true);
      expect(forced.has(ShipmentOptionName.Signature)).toBe(true);
    });

    it('handles circular requires without infinite loop', async () => {
      const {forcedOn} = await setupWithCapabilities(
        CarrierName.PostNl,
        [
          {
            carrier: 'POSTNL',
            packageTypes: ['PACKAGE'],
            deliveryTypes: ['STANDARD_DELIVERY'],
            options: {
              requiresSignature: {...DEFAULT_OPTION, requires: ['recipientOnlyDelivery']},
              recipientOnlyDelivery: {...DEFAULT_OPTION, requires: ['requiresSignature']},
            },
          },
        ],
        [ShipmentOptionName.Signature],
      );

      expect(toValue(forcedOn).has(ShipmentOptionName.OnlyRecipient)).toBe(true);
    });
  });

  describe('forcedOff', () => {
    it('excludes options listed in excludes of active options', async () => {
      const {forcedOff} = await setupWithCapabilities(
        CarrierName.PostNl,
        [
          {
            carrier: 'POSTNL',
            packageTypes: ['PACKAGE'],
            deliveryTypes: ['STANDARD_DELIVERY'],
            options: {
              requiresSignature: {...DEFAULT_OPTION, excludes: ['priorityDelivery']},
              priorityDelivery: {...DEFAULT_OPTION},
            },
          },
        ],
        [ShipmentOptionName.Signature],
      );

      expect(toValue(forcedOff).has(ShipmentOptionName.PriorityDelivery)).toBe(true);
    });

    it('does not exclude when the excluding option is not active', async () => {
      const {forcedOff} = await setupWithCapabilities(CarrierName.PostNl, [
        {
          carrier: 'POSTNL',
          packageTypes: ['PACKAGE'],
          deliveryTypes: ['STANDARD_DELIVERY'],
          options: {
            requiresSignature: {...DEFAULT_OPTION, excludes: ['priorityDelivery']},
            priorityDelivery: {...DEFAULT_OPTION},
          },
        },
      ]);

      expect(toValue(forcedOff).has(ShipmentOptionName.PriorityDelivery)).toBe(false);
    });

    it('forcedOn wins over forcedOff conflict', async () => {
      // A is isRequired (forcedOn), B excludes A (would put A in forcedOff)
      // A should NOT be in forcedOff
      const {forcedOn, forcedOff} = await setupWithCapabilities(
        CarrierName.PostNl,
        [
          {
            carrier: 'POSTNL',
            packageTypes: ['PACKAGE'],
            deliveryTypes: ['STANDARD_DELIVERY'],
            options: {
              requiresSignature: {...DEFAULT_OPTION, isRequired: true},
              recipientOnlyDelivery: {...DEFAULT_OPTION, excludes: ['requiresSignature']},
            },
          },
        ],
        [ShipmentOptionName.OnlyRecipient],
      );

      expect(toValue(forcedOn).has(ShipmentOptionName.Signature)).toBe(true);
      expect(toValue(forcedOff).has(ShipmentOptionName.Signature)).toBe(false);
    });
  });

  describe('defaults', () => {
    it('includes options with isSelectedByDefault: true', async () => {
      const {defaults} = await setupWithCapabilities(CarrierName.PostNl, [
        {
          carrier: 'POSTNL',
          packageTypes: ['PACKAGE'],
          deliveryTypes: ['STANDARD_DELIVERY'],
          options: {
            requiresSignature: {...DEFAULT_OPTION, isSelectedByDefault: true},
            recipientOnlyDelivery: {...DEFAULT_OPTION},
          },
        },
      ]);

      expect(toValue(defaults)).toContain(ShipmentOptionName.Signature);
      expect(toValue(defaults)).not.toContain(ShipmentOptionName.OnlyRecipient);
    });
  });

  describe('edge cases', () => {
    it('returns empty sets when no carrier is selected', () => {
      useShipmentOptionRules.clear();
      mockDeliveryOptionsConfig();

      const {forcedOn, forcedOff, defaults} = useShipmentOptionRules();

      expect(toValue(forcedOn).size).toBe(0);
      expect(toValue(forcedOff).size).toBe(0);
      expect(toValue(defaults)).toHaveLength(0);
    });

    it('ignores unknown capability names in requires', async () => {
      const {forcedOn} = await setupWithCapabilities(
        CarrierName.PostNl,
        [
          {
            carrier: 'POSTNL',
            packageTypes: ['PACKAGE'],
            deliveryTypes: ['STANDARD_DELIVERY'],
            options: {
              requiresSignature: {...DEFAULT_OPTION},
              recipientOnlyDelivery: {...DEFAULT_OPTION, requires: ['unknownOption', 'requiresSignature']},
            },
          },
        ],
        [ShipmentOptionName.OnlyRecipient],
      );

      const forced = toValue(forcedOn);

      expect(forced.has(ShipmentOptionName.Signature)).toBe(true);
      expect(forced.size).toBe(1);
    });
  });
});
