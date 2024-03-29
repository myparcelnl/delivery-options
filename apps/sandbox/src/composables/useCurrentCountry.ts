import {computed, type ComputedRef} from 'vue';
import {useSandboxStore} from '../stores';

export const useCurrentCountry = (): ComputedRef<string> => {
  const sandboxStore = useSandboxStore();

  return computed(() => sandboxStore.resolvedConfiguration.address.cc);
};
