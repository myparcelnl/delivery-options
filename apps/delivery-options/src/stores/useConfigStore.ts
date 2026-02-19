import {type DeliveryOptionsStore} from '.';
import {reactive} from 'vue';
import {assign} from 'radash';
import {
  getDefaultDeliveryOptionsConfig,
  type DeliveryOptionsConfig,
  type ResolvedDeliveryOptionsConfig,
} from '@myparcel-dev/do-shared';

const initialState = getDefaultDeliveryOptionsConfig();

const state = reactive<ResolvedDeliveryOptionsConfig>({...initialState});

function update(configuration: DeliveryOptionsConfig, withDefaults = true): void {
  if (withDefaults) {
    Object.assign(state, assign(getDefaultDeliveryOptionsConfig(), configuration));
  } else {
    Object.assign(state, configuration);
  }
}

// Reset to the initial state
function reset(): void {
  Object.assign(state, initialState);
}

export const useConfigStore = (): DeliveryOptionsStore<
  ResolvedDeliveryOptionsConfig,
  DeliveryOptionsConfig,
  [boolean]
> => {
  return {
    state,
    update,
    reset,
  };
};
