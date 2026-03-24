import {computed, effectScope, type EffectScope} from 'vue';
import {type UseCapabilities, useReactiveCapabilities} from '@myparcel-dev/do-shared';
import {useConfigStore} from '../stores';
import {useBroadCapabilitiesParams} from './useCapabilitiesRequestParams';

let instance: UseCapabilities | null = null;
let scope: EffectScope | null = null;

/**
 * Singleton reactive capabilities instance that re-fetches
 * when address or packageType changes.
 */
export const useBroadCapabilities = (): UseCapabilities => {
  if (!instance) {
    scope = effectScope();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    instance = scope.run(() => {
      const {state: config} = useConfigStore();
      const requestRef = useBroadCapabilitiesParams();

      const apiKeyRef = computed(() => config.apiKey);
      return useReactiveCapabilities(config.proxyCapabilities, requestRef, apiKeyRef);
    })!;
  }

  return instance;
};

/**
 * Reset the singleton (for app teardown / test cleanup).
 * Stops all reactive effects and clears data to prevent stale references
 * from triggering downstream reactive chains.
 */
export const resetBroadCapabilities = (): void => {
  if (instance) {
    instance.capabilities.value = {results: []};
  }

  if (scope) {
    scope.stop();
    scope = null;
  }

  instance = null;
};
