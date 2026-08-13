/**
 * Single owner of all shipment option decisions.
 *
 * Every rule that decides whether a shipment option is shown, checked, locked or selected by
 * default lives here, in the pure resolve* functions. Everything else (the options list builder,
 * the selector component) only reads the outcome, so there is never a second place that can
 * disagree about an option's state.
 *
 * Flow, from input to screen:
 *
 *   capability options   (per carrier, from the capabilities API)   ─┐
 *   consumer selection   (checkboxes the consumer ticked)            │
 *   cart options         (per carrier, sent by the plugin: the       │
 *                         starting state for options the consumer    │
 *                         can pick, and active for the rules)        │
 *   allowed options      (shop configuration allow* flags)           │
 *   delivery moment      (options of the selected moment)           ─┘
 *
 *   resolveForcedOptions   → forcedOn / forcedOff   (rules, cart, selection)
 *   resolveDefaultOptions  → defaults               (rules, cart, allowed)
 *   resolveOptionStates    → optionStates           (allowed, moment, forced)
 *   resolveSelection       → selection              (selection, forced, optionStates)
 *                                                                │
 *                          ┌───────────────────────────────────┬─┘
 *                          ▼                                   ▼
 *          useShipmentOptionsOptions              ShipmentOptionsSelector.vue
 *          (adds label and price, no decisions)   (shows the selection, stores the
 *                                                  consumer's own picks)
 *
 * Each outcome is a separate computed over only the inputs listed after it, so a change in one
 * input cannot ripple into an outcome that does not depend on it.
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
  mapShipmentOptionToCapability,
  resolveCarrierName,
  toShipmentOptionNames,
  useLogger,
} from '@myparcel-dev/do-shared';
import {type SelectedDeliveryMoment} from '../types';
import {useCartShipmentOptionsStore} from '../stores';
import {useSelectedValues} from './useSelectedValues';
import {useSelectedDeliveryMoment} from './useSelectedDeliveryMoment';
import {useResolvedCarrier} from './useResolvedCarrier';
import {useFeatures} from './useFeatures';

/** One shipment option as the delivery options API returns it for the selected delivery moment. */
type MomentOption = SelectedDeliveryMoment['shipmentOptions'][number];

/** Capability options of one carrier, keyed by capability key (e.g. 'requiresSignature'). */
type CapabilityRules = Readonly<Record<string, CapabilityOption>>;

/** Cart options for one carrier as the plugin calculated them (option name → on/off). */
type CartOptions = Readonly<Record<string, boolean>> | undefined;

export interface ShipmentOptionState {
  /** The widget option name, e.g. 'signature'. */
  name: SupportedShipmentOptionName;
  /** True when the consumer cannot change the checkbox. */
  disabled: boolean;
  /** Pre-set value when the delivery moment leaves only one choice; false otherwise. */
  selected: boolean;
}

/** Widget option names that must be checked, and those that must be unchecked. */
export interface ForcedOptions {
  forcedOn: Set<string>;
  forcedOff: Set<string>;
}

export interface UseShipmentOptionsState {
  /** Widget option names that must be checked and locked. */
  forcedOn: ComputedRef<Set<string>>;
  /** Widget option names that must be unchecked and locked. */
  forcedOff: ComputedRef<Set<string>>;
  /** Widget option names that start out checked when the consumer has not chosen anything yet. */
  defaults: ComputedRef<string[]>;
  /** The options to render, in display order, each with its checkbox state. */
  optionStates: ComputedRef<ShipmentOptionState[]>;
  /**
   * The options that count as checked: the consumer's picks that are still on screen, plus
   * everything forced on. A pick disappears by itself once the chosen carrier no longer offers
   * the option, so nothing has to clean up after a carrier switch.
   */
  selection: ComputedRef<string[]>;
}

/**
 * Work out the capability options that are forced on or off. If two rules disagree, the first rule
 * has effect. The resolver writes a warning about the other rule.
 *
 * @param rules - Capability options of the current carrier, keyed by capability key.
 * @param activeKeys - Capability keys of the options that the cart holds or the consumer selected.
 *   The function reads the options that the carrier requires from `rules`.
 */
const collectForcedCapabilities = (
  rules: Readonly<Record<string, CapabilityOption>>,
  activeKeys: readonly string[],
): {forcedOnCapability: Set<string>; forcedOffCapability: Set<string>} => {
  const requiredKeys = Object.keys(rules).filter((key) => rules[key]?.isRequired);

  // The carrier requires these options. These options are selected and locked.
  const forcedOnCapability = new Set<string>(requiredKeys);
  const forcedOffCapability = new Set<string>();

  // The rules come from two groups of options: the group that the carrier requires, and the group
  // that is active. An option can be in both groups, and thus the set removes the duplicates. An
  // active option is a source of rules only. It does not force its own value, and the consumer
  // keeps control of that checkbox.
  const ruleSources = new Set([...requiredKeys, ...activeKeys]);

  // The queue holds the options that the loop must still read. The visited set prevents an endless
  // loop if two options require each other.
  const queue = [...ruleSources];
  const visited = new Set<string>(ruleSources);

  // A for-of loop over an array also reads the items that the loop adds. The queue thus becomes
  // longer while the loop finds more requires rules.
  for (const capabilityKey of queue) {
    for (const required of rules[capabilityKey]?.requires ?? []) {
      if (forcedOffCapability.has(required)) {
        logRuleConflict(required, capabilityKey, 'require', 'excluded');

        continue;
      }

      // The widget cannot show all of these keys. A key that it cannot show is kept, and thus the
      // rules behind that key also apply.
      forcedOnCapability.add(required);

      if (!visited.has(required)) {
        // Add the option to the end of the queue. The rules of the active options apply first.
        // The rules of an option from a requires chain apply after them.
        visited.add(required);
        queue.push(required);
      }
    }

    for (const excluded of rules[capabilityKey]?.excludes ?? []) {
      if (forcedOnCapability.has(excluded)) {
        logRuleConflict(excluded, capabilityKey, 'exclude', 'required');

        continue;
      }

      forcedOffCapability.add(excluded);
    }
  }

  return {forcedOnCapability, forcedOffCapability};
};

/**
 * Write a warning about a rule that the resolver does not apply. The capabilities data has a
 * conflict. Correct the data at the source.
 *
 * @param optionKey - Capability option the rule points at.
 * @param sourceKey - Capability option that holds the rule.
 * @param action - `require` or `exclude`.
 * @param state - `required` or `excluded`.
 */
const logRuleConflict = (optionKey: string, sourceKey: string, action: string, state: string): void => {
  useLogger().warning(
    `Can't ${action} "${optionKey}", it's already ${state} by another option; capabilities rules contradict each other.`,
    {option: optionKey, source: sourceKey, action, state},
  );
};

/**
 * Decide which options render and with what checkbox state.
 *
 * @param input - The rendering inputs: the carrier's capability rules, the shop's allowed
 *   options, all widget option names in display order, the delivery moment's option list,
 *   and the resolved forced-on/forced-off sets (in widget option names).
 */
export const resolveOptionStates = (input: {
  /** Widget option names the shop configuration allows showing (the allow* flags). */
  allowedOptions: ReadonlySet<string>;
  /** All widget option names, in display order. */
  supportedOptions: readonly SupportedShipmentOptionName[];
  /** The option list of the selected delivery moment, or undefined when it gives no list. */
  momentOptions: readonly MomentOption[] | undefined;
  forcedOn: ReadonlySet<string>;
  forcedOff: ReadonlySet<string>;
}): ShipmentOptionState[] => {
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
 * Work out which options must be checked and which must be unchecked, in widget option names.
 * Options that are on — the cart's and the consumer's — do not force themselves; their effect
 * runs through the capability rules. Capability options without a widget option are dropped at
 * the end, so they can take part in the rules without ever reaching the screen.
 *
 * @param rules - Capability options of the current carrier.
 * @param cartOptions - Cart options for this carrier.
 * @param selectedOptions - Widget option names the consumer has checked.
 */
export const resolveForcedOptions = (
  rules: CapabilityRules,
  cartOptions: CartOptions,
  selectedOptions: readonly string[],
): ForcedOptions => {
  const activeKeys = [...Object.keys(cartOptions ?? {}).filter((name) => cartOptions?.[name]), ...selectedOptions]
    .map((name) => mapShipmentOptionToCapability(name))
    .filter((key): key is string => key !== undefined && key in rules);

  const {forcedOnCapability, forcedOffCapability} = collectForcedCapabilities(rules, activeKeys);

  return {forcedOn: toShipmentOptionNames(forcedOnCapability), forcedOff: toShipmentOptionNames(forcedOffCapability)};
};

/**
 * Work out which options start out checked when the consumer has not chosen anything yet: the
 * ones the carrier selects by default, overruled by the cart's calculated value for every option
 * the consumer can pick — on means checked to begin with, off means unchecked. Deliberately
 * independent of the consumer's selection, so their clicks never change the starting state.
 *
 * @param rules - Capability options of the current carrier.
 * @param cartOptions - Cart options for this carrier.
 * @param allowedOptions - Widget option names the shop configuration allows showing.
 */
export const resolveDefaultOptions = (
  rules: CapabilityRules,
  cartOptions: CartOptions,
  allowedOptions: ReadonlySet<string>,
): string[] => {
  const defaultKeys = Object.keys(rules).filter((key) => rules[key]?.isSelectedByDefault);
  const defaults = toShipmentOptionNames(defaultKeys);

  for (const [name, isOn] of Object.entries(cartOptions ?? {})) {
    if (!allowedOptions.has(name)) {
      continue;
    }

    if (isOn) {
      defaults.add(name);
    } else {
      defaults.delete(name);
    }
  }

  return [...defaults];
};

/**
 * Work out which options count as checked: the consumer's picks that are still on screen, plus
 * everything forced on, minus everything forced off.
 *
 * @param input - The consumer's picks, the forced sets, the options on screen, and whether the
 *   carrier's capabilities have arrived — until they have, the picks are left alone, because
 *   filtering on what is not known yet would briefly empty the output.
 */
export const resolveSelection = (input: {
  selectedOptions: readonly string[];
  forcedOn: ReadonlySet<string>;
  forcedOff: ReadonlySet<string>;
  optionStates: readonly ShipmentOptionState[];
  capabilitiesKnown: boolean;
}): string[] => {
  const {selectedOptions, forcedOn, forcedOff, optionStates, capabilitiesKnown} = input;

  const onScreen = new Set<string>(optionStates.map(({name}) => name));
  const picked = capabilitiesKnown ? selectedOptions.filter((name) => onScreen.has(name)) : selectedOptions;

  return [...new Set([...picked, ...forcedOn])].filter((name) => !forcedOff.has(name));
};

/**
 * Reactive shipment option state for the carrier the consumer picked.
 *
 * Each outcome is its own computed over just the inputs it needs, so it is only recalculated
 * when something it actually depends on changes: the defaults, for instance, do not depend on
 * the consumer's selection, so clicking a checkbox leaves them untouched. Call it inside a
 * component's setup or another composable; every caller reads the same shared stores, so the
 * outcomes are identical everywhere.
 */
export function useShipmentOptionsState(): UseShipmentOptionsState {
  const deliveryMoment = useSelectedDeliveryMoment();
  const {shipmentOptions: selectedOptions} = useSelectedValues();
  const {state: cartShipmentOptions} = useCartShipmentOptionsStore();
  const {availableShipmentOptions} = useFeatures();

  const carrier = computed(() => {
    const carrierId = deliveryMoment.value?.carrier;

    return carrierId ? useResolvedCarrier(carrierId) : undefined;
  });

  const capabilityOptions = computed(() => carrier.value?.capability.value?.options);
  const rules = computed<CapabilityRules>(() => capabilityOptions.value ?? {});
  const allowedOptions = computed(() => carrier.value?.shipmentOptions.value ?? new Set<string>());

  // The cart options map is keyed by bare carrier name; identifiers with a contract id
  // ('postnl:123') resolve to that name.
  const cartOptions = computed(() => {
    const carrierId = deliveryMoment.value?.carrier;

    return carrierId ? cartShipmentOptions[resolveCarrierName(carrierId)] : undefined;
  });

  const forced = computed(() => resolveForcedOptions(rules.value, cartOptions.value, selectedOptions.value));
  const forcedOn = computed(() => forced.value.forcedOn);
  const forcedOff = computed(() => forced.value.forcedOff);

  const defaults = computed(() => resolveDefaultOptions(rules.value, cartOptions.value, allowedOptions.value));

  const optionStates = computed(() =>
    resolveOptionStates({
      allowedOptions: allowedOptions.value,
      supportedOptions: availableShipmentOptions.value,
      momentOptions: deliveryMoment.value?.shipmentOptions,
      forcedOn: forcedOn.value,
      forcedOff: forcedOff.value,
    }),
  );

  const selection = computed(() =>
    resolveSelection({
      selectedOptions: selectedOptions.value,
      forcedOn: forcedOn.value,
      forcedOff: forcedOff.value,
      optionStates: optionStates.value,
      capabilitiesKnown: capabilityOptions.value !== undefined,
    }),
  );

  return {forcedOn, forcedOff, defaults, optionStates, selection};
}
