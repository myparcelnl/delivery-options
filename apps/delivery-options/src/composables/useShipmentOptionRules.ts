import {computed, type ComputedRef} from 'vue';
import {useMemoize} from '@vueuse/core';
import {type CapabilityOption, type SupportedShipmentOptionName, mapCapabilityOption} from '@myparcel-dev/do-shared';
import {useSelectedDeliveryMoment} from './useSelectedDeliveryMoment';
import {useSelectedValues} from './useSelectedValues';
import {useResolvedCarrier} from './useResolvedCarrier';

interface ShipmentOptionRuleState {
  /** Options that must be checked and can't be unchecked (isRequired + required by selected). */
  forcedOn: ComputedRef<Set<string>>;
  /** Options excluded by currently active options — disabled and unchecked. */
  forcedOff: ComputedRef<Set<string>>;
  /** SDK names with isSelectedByDefault: true — used for initial selection. */
  defaults: ComputedRef<string[]>;
}

/** Map capability names in requires/excludes arrays to SDK names, filtering out unknown options. */
const mapRuleRefs = (refs: string[]): string[] =>
  refs.map(mapCapabilityOption).filter((n): n is SupportedShipmentOptionName => n !== undefined);

/**
 * Computes which shipment options are forced on, forced off, or selected by default
 * based on the capability option rules (requires, excludes, isRequired, isSelectedByDefault).
 */
export const useShipmentOptionRules = useMemoize((): ShipmentOptionRuleState => {
  const deliveryMoment = useSelectedDeliveryMoment();
  const {shipmentOptions} = useSelectedValues();

  /** Capability options keyed by SDK name for the current carrier. */
  const sdkRulesMap = computed((): Map<string, CapabilityOption> => {
    const carrierId = deliveryMoment.value?.carrier;

    if (!carrierId) {
      return new Map();
    }

    const cap = useResolvedCarrier(carrierId).capability.value;

    if (!cap) {
      return new Map();
    }

    const map = new Map<string, CapabilityOption>();

    for (const [capName, option] of Object.entries(cap.options)) {
      const sdkName = mapCapabilityOption(capName);

      if (sdkName) {
        map.set(sdkName, option);
      }
    }

    return map;
  });

  const forcedOn = computed((): Set<string> => {
    const forced = new Set<string>();
    const visited = new Set<string>();

    const addTransitive = (sdkName: string) => {
      if (visited.has(sdkName)) {
        return;
      }

      visited.add(sdkName);
      const rules = sdkRulesMap.value.get(sdkName);

      if (!rules) {
        return;
      }

      for (const req of mapRuleRefs(rules.requires)) {
        forced.add(req);
        addTransitive(req);
      }
    };

    for (const [sdkName, rules] of sdkRulesMap.value) {
      if (rules.isRequired) {
        forced.add(sdkName);
        addTransitive(sdkName);
      }
    }

    for (const selected of shipmentOptions.value) {
      addTransitive(selected);
    }

    return forced;
  });

  const forcedOff = computed((): Set<string> => {
    const excluded = new Set<string>();
    const active = new Set([...shipmentOptions.value, ...forcedOn.value]);

    for (const opt of active) {
      const rules = sdkRulesMap.value.get(opt);

      if (!rules) {
        continue;
      }

      for (const excl of mapRuleRefs(rules.excludes)) {
        if (!forcedOn.value.has(excl)) {
          excluded.add(excl);
        }
      }
    }

    return excluded;
  });

  const defaults = computed((): string[] => {
    return [...sdkRulesMap.value.entries()]
      .filter(([, rules]) => rules.isSelectedByDefault)
      .map(([sdkName]) => sdkName);
  });

  return {forcedOn, forcedOff, defaults};
});
