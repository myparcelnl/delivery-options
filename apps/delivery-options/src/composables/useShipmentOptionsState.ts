/**
 * Single owner of all shipment option decisions.
 *
 * Every rule that decides whether a shipment option is shown, checked, locked or selected by
 * default lives here, in the pure function resolveShipmentOptionsState. Everything else (the
 * options list builder, the selector component) only reads the outcome, so there is never a
 * second place that can disagree about an option's state.
 *
 * Flow, from input to screen:
 *
 *   capability options   (per carrier, from the capabilities API)   ─┐
 *   consumer selection   (checkboxes the consumer ticked)            │
 *   cart options         (per carrier, sent by the plugin)           ├─> resolveShipmentOptionsState()
 *   allowed options      (shop configuration allow* flags)           │           │
 *   delivery moment      (options of the selected moment)           ─┘           ▼
 *                                                {forcedOn, forcedOff, defaults, optionStates}
 *                                                                                │
 *                          ┌───────────────────────────────────────────────────┬─┘
 *                          ▼                                                   ▼
 *          useShipmentOptionsOptions                            ShipmentOptionsSelector.vue
 *          (adds label and price, no decisions)                 (applies defaults and forced
 *                                                                sets to the selection)
 *
 * The rules are evaluated using capability option keys (e.g. 'requiresSignature') so that
 * requirements can pass through options the widget cannot show (e.g. 'requiresAgeVerification').
 * Only at the very end are the results translated to the widget's option names
 * (e.g. 'signature'); anything without a widget name is left out of the output.
 */
import {computed, type ComputedRef} from 'vue';
import {
  type CapabilityOption,
  type SupportedShipmentOptionName,
  mapCapabilityOption,
  mapCartShipmentOptionToCapability,
  mapShipmentOptionToCapability,
  resolveCarrierName,
} from '@myparcel-dev/do-shared';
import {type SelectedDeliveryMoment} from '../types';
import {useCartShipmentOptionsStore} from '../stores';
import {useSelectedValues} from './useSelectedValues';
import {useSelectedDeliveryMoment} from './useSelectedDeliveryMoment';
import {useResolvedCarrier} from './useResolvedCarrier';
import {useFeatures} from './useFeatures';

/** One shipment option as the delivery options API returns it for the selected delivery moment. */
type MomentOption = SelectedDeliveryMoment['shipmentOptions'][number];

export interface ResolveShipmentOptionsInput {
  /** Capability options of the current carrier, keyed by capability key; undefined while capabilities have not loaded. */
  capabilityOptions: Readonly<Record<string, CapabilityOption>> | undefined;
  /** Widget option names the consumer has checked (e.g. 'signature'). */
  selectedOptions: readonly string[];
  /** Cart options for this carrier from the plugin (option name → on/off); undefined when the plugin sent none. */
  cartOptions: Readonly<Record<string, boolean>> | undefined;
  /** Widget option names the shop configuration allows showing (the allow* flags). */
  allowedOptions: ReadonlySet<string>;
  /** All widget option names, in display order. */
  supportedOptions: readonly SupportedShipmentOptionName[];
  /** The option list of the selected delivery moment, or undefined when the moment gives no list. */
  momentOptions: readonly MomentOption[] | undefined;
}

export interface ShipmentOptionState {
  /** The widget option name, e.g. 'signature'. */
  name: SupportedShipmentOptionName;
  /** True when the consumer cannot change the checkbox. */
  disabled: boolean;
  /** Pre-set value when the delivery moment leaves only one choice; false otherwise. */
  selected: boolean;
}

export interface ResolvedShipmentOptionsState {
  /** Widget option names that must be checked and locked. */
  forcedOn: Set<string>;
  /** Widget option names that must be unchecked and locked. */
  forcedOff: Set<string>;
  /** Widget option names that start out checked when the consumer has not chosen anything yet. */
  defaults: string[];
  /** The options to render, in display order, each with its checkbox state. */
  optionStates: ShipmentOptionState[];
}

/** The same outcomes as {@link ResolvedShipmentOptionsState}, exposed as reactive values. */
type UseShipmentOptionsState = {
  [Key in keyof ResolvedShipmentOptionsState]: ComputedRef<ResolvedShipmentOptionsState[Key]>;
};

/**
 * Translate a set of capability keys to widget option names, leaving out keys the widget
 * has no option for.
 *
 * @param capabilityKeys - Capability option keys, e.g. 'requiresSignature'.
 */
const toUiNames = (capabilityKeys: Iterable<string>): Set<string> => {
  const names = new Set<string>();

  for (const capabilityKey of capabilityKeys) {
    const uiName = mapCapabilityOption(capabilityKey);

    if (uiName) {
      names.add(uiName);
    }
  }

  return names;
};

/**
 * Find the cart options that seed forcing. An entry qualifies when the cart ships with it
 * (true), the carrier's capability knows the option, and the consumer cannot select it
 * themselves. Options the consumer can already tick are left alone.
 *
 * @param rules - Capability options of the current carrier, keyed by capability key.
 * @param cartOptions - Cart options for this carrier (option name → on/off), or undefined when the plugin sent none.
 * @param allowedOptions - Widget option names the shop configuration allows showing.
 * @returns Capability keys of the cart options that must be forced.
 */
const collectCartSeeds = (
  rules: Readonly<Record<string, CapabilityOption>>,
  cartOptions: Readonly<Record<string, boolean>> | undefined,
  allowedOptions: ReadonlySet<string>,
): string[] => {
  const cartSeeds: string[] = [];

  for (const [optionName, isOn] of Object.entries(cartOptions ?? {})) {
    if (!isOn) {
      continue;
    }

    const capabilityKey = mapCartShipmentOptionToCapability(optionName);

    if (!capabilityKey || !(capabilityKey in rules)) {
      continue;
    }

    const uiName = mapCapabilityOption(capabilityKey);
    const isConsumerSelectable = uiName !== undefined && allowedOptions.has(uiName);

    if (!isConsumerSelectable) {
      cartSeeds.push(capabilityKey);
    }
  }

  return cartSeeds;
};

/**
 * Work out which capability options are forced on. Options the carrier marks as required and
 * cart options force themselves plus everything they require; consumer-selected options force
 * only their requirements, not themselves — the consumer chose them and may still change
 * their mind. Requirement references are followed through options the widget cannot show, so
 * requirements behind them are not lost. Safe with circular requires.
 *
 * @param rules - Capability options of the current carrier, keyed by capability key.
 * @param cartSeeds - Capability keys of cart options that must be forced.
 * @param selectedCapabilityKeys - Capability keys of the options the consumer has checked.
 * @returns Capability keys that must be checked and locked.
 */
const collectForcedOnCapability = (
  rules: Readonly<Record<string, CapabilityOption>>,
  cartSeeds: readonly string[],
  selectedCapabilityKeys: readonly string[],
): Set<string> => {
  const forcedOnCapability = new Set<string>();
  const visited = new Set<string>();

  /**
   * Add everything the given capability option requires, directly or through other options,
   * to the forced-on set.
   *
   * @param capabilityKey - The capability option key to start from.
   */
  const addRequirements = (capabilityKey: string): void => {
    if (visited.has(capabilityKey)) {
      return;
    }

    visited.add(capabilityKey);
    const option = rules[capabilityKey];

    if (!option) {
      return;
    }

    for (const required of option.requires) {
      forcedOnCapability.add(required);
      addRequirements(required);
    }
  };

  for (const [capabilityKey, option] of Object.entries(rules)) {
    if (option.isRequired) {
      forcedOnCapability.add(capabilityKey);
      addRequirements(capabilityKey);
    }
  }

  // The cart ships with these options, so the consumer must not be able to turn them or
  // anything they depend on off.
  for (const seed of cartSeeds) {
    forcedOnCapability.add(seed);
    addRequirements(seed);
  }

  for (const capabilityKey of selectedCapabilityKeys) {
    addRequirements(capabilityKey);
  }

  return forcedOnCapability;
};

/**
 * Work out which capability options are forced off. Every active option (consumer-selected,
 * forced on, or coming from the cart) blocks the options it excludes. When an option is both
 * forced on and excluded, forced on wins.
 *
 * @param rules - Capability options of the current carrier, keyed by capability key.
 * @param selectedCapabilityKeys - Capability keys of the options the consumer has checked.
 * @param forcedOnCapability - Capability keys that are forced on; cart seeds are part of this set.
 * @returns Capability keys that must be unchecked and locked.
 */
const collectForcedOffCapability = (
  rules: Readonly<Record<string, CapabilityOption>>,
  selectedCapabilityKeys: readonly string[],
  forcedOnCapability: ReadonlySet<string>,
): Set<string> => {
  const activeCapability = new Set<string>([...forcedOnCapability, ...selectedCapabilityKeys]);

  const forcedOffCapability = new Set<string>();

  for (const activeKey of activeCapability) {
    const option = rules[activeKey];

    if (!option) {
      continue;
    }

    for (const excluded of option.excludes) {
      if (!forcedOnCapability.has(excluded)) {
        forcedOffCapability.add(excluded);
      }
    }
  }

  return forcedOffCapability;
};

/**
 * Decide which options render and with what checkbox state.
 *
 * @param input - The rendering inputs: the carrier's capability rules, the shop's allowed
 *   options, all widget option names in display order, the delivery moment's option list,
 *   and the resolved forced-on/forced-off sets (in widget option names).
 */
const buildOptionStates = (
  input: Pick<ResolveShipmentOptionsInput, 'allowedOptions' | 'supportedOptions' | 'momentOptions'> & {
    forcedOn: ReadonlySet<string>;
    forcedOff: ReadonlySet<string>;
  },
): ShipmentOptionState[] => {
  const {allowedOptions, supportedOptions, momentOptions, forcedOn, forcedOff} = input;

  return supportedOptions.flatMap((name) => {
    // The shop's allow* settings decide what the consumer gets to see — always, forced or
    // not. An option the shop turned off can still end up on the shipment (the plugin
    // enforces that at export), but it is never shown here.
    if (!allowedOptions.has(name)) {
      return [];
    }

    const match = momentOptions?.find((momentOption) => momentOption.name === name);

    // When the selected delivery moment lists its own options, only those may show.
    if (momentOptions?.length && !match) {
      return [];
    }

    // When the delivery moment allows only one value the consumer has no choice: the
    // checkbox is locked to that value.
    const hasOnlyOneOption = match !== undefined && match.schema.enum.length === 1;

    return [
      {
        name,
        disabled: hasOnlyOneOption || forcedOn.has(name) || forcedOff.has(name),
        selected: hasOnlyOneOption ? match.schema.enum[0] === true : false,
      },
    ];
  });
};

/**
 * Decide the state of every shipment option: which are forced on or off, which are selected
 * by default, and which are rendered with what checkbox state. This is the only place where
 * those decisions are made — see the module docblock for the full flow.
 *
 * @param input - Plain data describing the current situation; see ResolveShipmentOptionsInput for what each field means.
 */
export const resolveShipmentOptionsState = (input: ResolveShipmentOptionsInput): ResolvedShipmentOptionsState => {
  const {capabilityOptions, selectedOptions, cartOptions, allowedOptions, supportedOptions, momentOptions} = input;

  const rules = capabilityOptions ?? {};

  // Map the consumer's selection to capability keys once; both collectors read it.
  const selectedCapabilityKeys = selectedOptions
    .map((name) => mapShipmentOptionToCapability(name as SupportedShipmentOptionName))
    .filter((key): key is string => key !== undefined);

  const cartSeeds = collectCartSeeds(rules, cartOptions, allowedOptions);
  const forcedOnCapability = collectForcedOnCapability(rules, cartSeeds, selectedCapabilityKeys);
  const forcedOffCapability = collectForcedOffCapability(rules, selectedCapabilityKeys, forcedOnCapability);

  // Options the carrier pre-selects, used for the initial selection.
  const defaultKeys = Object.entries(rules)
    .filter(([, option]) => option.isSelectedByDefault)
    .map(([capabilityKey]) => capabilityKey);

  // Translate to widget option names. Capability keys without a widget option
  // (e.g. 'requiresAgeVerification') are dropped here — they never reach the screen.
  const forcedOn = toUiNames(forcedOnCapability);
  const forcedOff = toUiNames(forcedOffCapability);
  const defaults = [...toUiNames(defaultKeys)];

  const optionStates = buildOptionStates({allowedOptions, supportedOptions, momentOptions, forcedOn, forcedOff});

  return {forcedOn, forcedOff, defaults, optionStates};
};

/**
 * Reactive wrapper around resolveShipmentOptionsState: gathers the inputs (capabilities,
 * consumer selection, cart options, shop configuration, delivery moment) and re-resolves
 * whenever one of them changes. Call it inside a component's setup or another composable;
 * every caller gets its own lightweight computed chain over the same shared stores, so the
 * outcomes are identical everywhere. Consumers only read the outputs; the rules live in the
 * pure function above.
 */
export function useShipmentOptionsState(): UseShipmentOptionsState {
  const deliveryMoment = useSelectedDeliveryMoment();
  const {shipmentOptions: selectedOptions} = useSelectedValues();
  const {state: cartShipmentOptions} = useCartShipmentOptionsStore();
  const {availableShipmentOptions} = useFeatures();

  const resolved = computed((): ResolvedShipmentOptionsState => {
    const carrierId = deliveryMoment.value?.carrier;
    const carrier = carrierId ? useResolvedCarrier(carrierId) : undefined;

    return resolveShipmentOptionsState({
      capabilityOptions: carrier?.capability.value?.options,
      selectedOptions: selectedOptions.value,
      // The cart options map is keyed by bare carrier name; identifiers with a contract id
      // ('postnl:123') resolve to that name.
      cartOptions: carrierId ? cartShipmentOptions[resolveCarrierName(carrierId)] : undefined,
      allowedOptions: carrier?.shipmentOptions.value ?? new Set(),
      supportedOptions: availableShipmentOptions.value,
      momentOptions: deliveryMoment.value?.shipmentOptions,
    });
  });

  return {
    forcedOn: computed(() => resolved.value.forcedOn),
    forcedOff: computed(() => resolved.value.forcedOff),
    defaults: computed(() => resolved.value.defaults),
    optionStates: computed(() => resolved.value.optionStates),
  };
}
