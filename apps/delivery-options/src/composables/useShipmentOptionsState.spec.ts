import {nextTick, toValue, watch} from 'vue';
import {describe, it, expect, beforeEach, vi} from 'vitest';
import {flushPromises} from '@vue/test-utils';
import {DEFAULT_OPTION, mockCapabilitiesFetch} from '@myparcel-dev/do-shared/testing';
import {
  AddressField,
  CarrierSetting,
  KEY_ADDRESS,
  KEY_CARRIER_SETTINGS,
  KEY_CART_SHIPMENT_OPTIONS,
  KEY_CONFIG,
  type CarrierCapability,
  type CartShipmentOptions,
  type CapabilitiesResponse,
} from '@myparcel-dev/do-shared';
import {CarrierName, ShipmentOptionName} from '@myparcel-dev/constants';
import {useAddressStore, useCartShipmentOptionsStore, useConfigStore} from '../stores';
import {mockDeliveryOptionsConfig} from '../__tests__';
import {useShipmentOptionsState} from './useShipmentOptionsState';
import {useSelectedValues} from './useSelectedValues';

/**
 * Collect just the option names from a list of option states.
 *
 * @param states - The optionStates output of useShipmentOptionsState.
 */
const optionNames = (states: readonly {name: string}[]): string[] => states.map(({name}) => name);

/** Whether one option's checkbox is locked. */
const isDisabled = (states: readonly {name: string; disabled: boolean}[], name: string): boolean | undefined =>
  states.find((state) => state.name === name)?.disabled;

const setupWithCapabilities = async (
  carrier: CarrierName,
  capabilities?: CarrierCapability[],
  selectedOptions: string[] = [],
  cartShipmentOptions: CartShipmentOptions | [] | undefined = undefined,
): Promise<ReturnType<typeof useShipmentOptionsState>> => {
  if (capabilities) {
    mockCapabilitiesFetch.mockImplementation((url: string, options?: RequestInit) => {
      void url;
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
    ...(cartShipmentOptions === undefined
      ? {}
      : {[KEY_CART_SHIPMENT_OPTIONS]: cartShipmentOptions as CartShipmentOptions}),
  });

  // Set delivery moment and selection BEFORE flushing so the reactive chain
  // triggers useSharedCapabilities() which kicks off the capabilities fetch.
  const {shipmentOptions} = useSelectedValues();
  shipmentOptions.value = selectedOptions;
  useSelectedValues().deliveryMoment.value = JSON.stringify({carrier});

  const state = useShipmentOptionsState();

  // Trigger evaluation to start capabilities loading
  toValue(state.forcedOn);
  await flushPromises();

  return state;
};

describe('useShipmentOptionsState', () => {
  beforeEach(() => {
    useSelectedValues.clear();
    useConfigStore().reset();
    useAddressStore().reset();
    useCartShipmentOptionsStore().reset();
    mockCapabilitiesFetch.mockRestore();
  });

  describe('cart shipment options', () => {
    it('forces the requirements of a cart option the consumer cannot select', async () => {
      // The PostNL mock capability has requiresAgeVerification with
      // requires: ['recipientOnlyDelivery', 'requiresSignature']. Age check is not a
      // consumer option, so shipping the cart with it must lock its requirements.
      const {forcedOn, forcedOff, defaults, optionStates, selection} = await setupWithCapabilities(
        CarrierName.PostNl,
        undefined,
        [],
        {[CarrierName.PostNl]: {ageCheck: true}},
      );

      const forced = toValue(forcedOn);

      expect(forced.has(ShipmentOptionName.Signature)).toBe(true);
      expect(forced.has(ShipmentOptionName.OnlyRecipient)).toBe(true);

      // Age check is not a widget option, so it may not turn up anywhere the widget reads or
      // emits — not in the rendered options, and not in the selection that becomes the output.
      const allOutputNames = [
        ...toValue(forcedOn),
        ...toValue(forcedOff),
        ...toValue(defaults),
        ...toValue(selection),
        ...optionNames(toValue(optionStates)),
      ];

      for (const name of ['requiresAgeVerification', 'ageCheck', 'age_check']) {
        expect(allOutputNames).not.toContain(name);
      }
    });

    it('does not force anything for a cart option that is off', async () => {
      const {forcedOn, forcedOff} = await setupWithCapabilities(CarrierName.PostNl, undefined, [], {
        [CarrierName.PostNl]: {ageCheck: false},
      });

      expect(toValue(forcedOn).size).toBe(0);
      expect(toValue(forcedOff).size).toBe(0);
    });

    it('starts a consumer option the cart enabled as checked, but leaves it toggleable', async () => {
      const {defaults, forcedOn, optionStates} = await setupWithCapabilities(CarrierName.PostNl, undefined, [], {
        [CarrierName.PostNl]: {signature: true},
      });

      // Checked to begin with...
      expect(toValue(defaults)).toContain(ShipmentOptionName.Signature);

      // ...but not locked: no rule forces it, so the consumer can turn it off again.
      expect(toValue(forcedOn).has(ShipmentOptionName.Signature)).toBe(false);
      expect(isDisabled(toValue(optionStates), ShipmentOptionName.Signature)).toBe(false);
    });

    it('starts a consumer option the cart disabled as unchecked, even when the carrier selects it by default', async () => {
      const {defaults} = await setupWithCapabilities(
        CarrierName.PostNl,
        [
          {
            carrier: 'POSTNL',
            packageTypes: ['PACKAGE'],
            deliveryTypes: ['STANDARD_DELIVERY'],
            options: {
              requiresSignature: {...DEFAULT_OPTION, isSelectedByDefault: true},
            },
          },
        ],
        [],
        {[CarrierName.PostNl]: {signature: false}},
      );

      expect(toValue(defaults)).not.toContain(ShipmentOptionName.Signature);
    });

    it('does not force a cart option the consumer can select themselves', async () => {
      const {forcedOn} = await setupWithCapabilities(CarrierName.PostNl, undefined, [], {
        [CarrierName.PostNl]: {signature: true},
      });

      expect(toValue(forcedOn).size).toBe(0);
    });

    it('does not force anything when the carrier does not support the cart option', async () => {
      // DPD's mock capability has no requiresAgeVerification option.
      const {forcedOn, forcedOff} = await setupWithCapabilities(CarrierName.Dpd, undefined, [], {
        [CarrierName.Dpd]: {ageCheck: true},
      });

      expect(toValue(forcedOn).size).toBe(0);
      expect(toValue(forcedOff).size).toBe(0);
    });

    it('does not apply cart options of one carrier to another carrier', async () => {
      const {forcedOn} = await setupWithCapabilities(
        CarrierName.DhlForYou,
        [
          {
            carrier: 'DHL_FOR_YOU',
            packageTypes: ['PACKAGE'],
            deliveryTypes: ['STANDARD_DELIVERY'],
            options: {
              requiresSignature: {...DEFAULT_OPTION},
              requiresAgeVerification: {...DEFAULT_OPTION, requires: ['requiresSignature']},
            },
          },
        ],
        [],
        {[CarrierName.PostNl]: {ageCheck: true}},
      );

      expect(toValue(forcedOn).size).toBe(0);
    });

    it('follows requirements through options the widget cannot show', async () => {
      // hideSender requires tracked, tracked requires requiresSignature. Neither hideSender
      // nor tracked is a consumer option, but the signature requirement behind them must
      // still be enforced.
      const {forcedOn} = await setupWithCapabilities(
        CarrierName.PostNl,
        [
          {
            carrier: 'POSTNL',
            packageTypes: ['PACKAGE'],
            deliveryTypes: ['STANDARD_DELIVERY'],
            options: {
              requiresSignature: {...DEFAULT_OPTION},
              tracked: {...DEFAULT_OPTION, requires: ['requiresSignature']},
              hideSender: {...DEFAULT_OPTION, requires: ['tracked']},
            },
          },
        ],
        [],
        {[CarrierName.PostNl]: {hideSender: true}},
      );

      const forced = toValue(forcedOn);

      expect(forced.has(ShipmentOptionName.Signature)).toBe(true);
      expect(forced.has('tracked')).toBe(false);
      expect(forced.has('hideSender')).toBe(false);
    });

    it.each([
      {label: 'absent', cart: undefined},
      {label: 'an empty object', cart: {}},
      {label: 'an empty array (PHP serialization)', cart: [] as const},
    ])('behaves as without the feature when cartShipmentOptions is $label', async ({cart}) => {
      const {forcedOn, forcedOff, defaults, optionStates} = await setupWithCapabilities(
        CarrierName.PostNl,
        undefined,
        [ShipmentOptionName.OnlyRecipient],
        cart,
      );

      // Same outcome as a run without cart shipment options: only the consumer-selected
      // only_recipient forces its required signature; everything else stays untouched.
      expect([...toValue(forcedOn)]).toEqual([ShipmentOptionName.Signature]);
      expect(toValue(forcedOff).size).toBe(0);
      expect(toValue(defaults)).toEqual([]);
      expect(optionNames(toValue(optionStates))).toEqual([
        ShipmentOptionName.Signature,
        ShipmentOptionName.OnlyRecipient,
        ShipmentOptionName.PriorityDelivery,
      ]);
    });
  });

  describe('forcedOn', () => {
    it('includes isRequired options', async () => {
      // DHL Europlus has requiresSignature.isRequired: true in mock data
      const {forcedOn} = await setupWithCapabilities(CarrierName.DhlEuroPlus);

      expect(toValue(forcedOn).has(ShipmentOptionName.Signature)).toBe(true);
    });

    it('includes required options when a requiring option is selected', async () => {
      // PostNL: recipientOnlyDelivery.requires: ['requiresSignature']
      const {forcedOn} = await setupWithCapabilities(CarrierName.PostNl, undefined, [ShipmentOptionName.OnlyRecipient]);

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
      mockDeliveryOptionsConfig();

      const {forcedOn, forcedOff, defaults} = useShipmentOptionsState();

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
  describe('defaults', () => {
    it('does not re-emit while the consumer changes their selection', async () => {
      // The selector seeds the defaults whenever they change and nothing is picked yet. If the
      // defaults re-emit on every click, unchecking the last option puts them all back.
      const {defaults} = await setupWithCapabilities(CarrierName.PostNl, undefined, [], {
        [CarrierName.PostNl]: {signature: true, onlyRecipient: true},
      });

      expect(toValue(defaults)).toEqual([ShipmentOptionName.Signature, ShipmentOptionName.OnlyRecipient]);

      const onDefaultsChange = vi.fn();

      watch(defaults, onDefaultsChange);

      useSelectedValues().shipmentOptions.value = [ShipmentOptionName.Signature];
      await nextTick();

      useSelectedValues().shipmentOptions.value = [];
      await nextTick();

      expect(onDefaultsChange).not.toHaveBeenCalled();
    });
  });

  describe('carrier switching', () => {
    it('leaves a picked option out once the carrier no longer offers it', async () => {
      // Signature picked while PostNL is chosen: it is on screen, so it counts.
      const postnl = await setupWithCapabilities(CarrierName.PostNl, undefined, [ShipmentOptionName.Signature]);

      expect(toValue(postnl.selection)).toContain(ShipmentOptionName.Signature);

      // DPD does not offer signature, so it is not on screen and drops out of the selection.
      const dpd = await setupWithCapabilities(CarrierName.Dpd, undefined, [ShipmentOptionName.Signature]);

      expect(toValue(dpd.selection)).not.toContain(ShipmentOptionName.Signature);
    });

    it('counts the options the cart forces as selected', async () => {
      const {selection} = await setupWithCapabilities(CarrierName.PostNl, undefined, [], {
        [CarrierName.PostNl]: {ageCheck: true},
      });

      expect(toValue(selection)).toContain(ShipmentOptionName.Signature);
      expect(toValue(selection)).toContain(ShipmentOptionName.OnlyRecipient);
    });

    it('does not count an option that is forced off', async () => {
      // requiresReceiptCode is excluded by age check in the PostNL mock capability.
      const {selection, forcedOff} = await setupWithCapabilities(CarrierName.PostNl, undefined, [], {
        [CarrierName.PostNl]: {ageCheck: true},
      });

      for (const option of toValue(forcedOff)) {
        expect(toValue(selection)).not.toContain(option);
      }
    });
  });
});
