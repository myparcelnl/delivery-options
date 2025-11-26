import {type DeliveryOptionsStore} from '.';
import {reactive} from 'vue';
import {assign} from 'radash';
import {
  getDefaultDeliveryOptionsConfig,
  PLATFORM_DEFAULT,
  type DeliveryOptionsConfig,
  type ResolvedDeliveryOptionsConfig,
} from '@myparcel-dev/shared';
import {getDefaultConfigForPlatform} from '../config';

const initialState = getDefaultDeliveryOptionsConfig();

const state = reactive<ResolvedDeliveryOptionsConfig>({...initialState});

function update(configuration: DeliveryOptionsConfig, withDefaults = true): void {
  if (withDefaults) {
    configuration.platform ??= PLATFORM_DEFAULT;
    Object.assign(state, assign(getDefaultConfigForPlatform(configuration.platform), configuration));
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
