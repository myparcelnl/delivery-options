import {type DeliveryOptionsStore} from '.';
import {reactive} from 'vue';
import {assign} from 'radash';
import {
  getDefaultDeliveryOptionsConfig,
  setSdkBaseUrl,
  type DeliveryOptionsConfig,
  type ResolvedDeliveryOptionsConfig,
} from '@myparcel-dev/do-shared';
import {clearState} from './clearState';

const initialState = getDefaultDeliveryOptionsConfig();

const state = reactive<ResolvedDeliveryOptionsConfig>({...initialState});

function update(configuration: DeliveryOptionsConfig, withDefaults = true): void {
  if (withDefaults) {
    Object.assign(state, assign(getDefaultDeliveryOptionsConfig(), configuration));
  } else {
    Object.assign(state, configuration);
  }

  setSdkBaseUrl(state.apiBaseUrl);
}

// Reset to the initial state
function reset(): void {
  clearState(state);

  Object.assign(state, initialState);

  setSdkBaseUrl(state.apiBaseUrl);
}

export const useConfigStore = (): DeliveryOptionsStore<
  ResolvedDeliveryOptionsConfig,
  DeliveryOptionsConfig,
  [boolean?]
> => {
  return {
    state,
    update,
    reset,
  };
};
