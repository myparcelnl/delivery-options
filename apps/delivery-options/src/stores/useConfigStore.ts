import {type DeliveryOptionsStore} from '.';
import {reactive} from 'vue';
import {assign} from 'radash';
import {
  getDefaultDeliveryOptionsConfig,
  PLATFORM_DEFAULT,
  type DeliveryOptionsConfig,
  type ResolvedDeliveryOptionsConfig,
} from '@myparcel-do/shared';
import {getDefaultConfigForPlatform} from '../config';

const initialState = getDefaultDeliveryOptionsConfig();

const state = reactive<ResolvedDeliveryOptionsConfig>({...initialState});

function update(configuration: DeliveryOptionsConfig): void {
  configuration.platform ??= PLATFORM_DEFAULT;
  Object.assign(state, assign(getDefaultConfigForPlatform(configuration.platform), configuration));
}

// Reset to the initial state
function reset(): void {
  Object.assign(state, initialState);
  console.log(state);
}

export const useConfigStore = (): DeliveryOptionsStore<ResolvedDeliveryOptionsConfig, DeliveryOptionsConfig> => {
  return {
    state,
    update,
    reset,
  };
};
