import {computed, type MaybeRef, ref, type ComputedRef} from 'vue';
import {get} from '@vueuse/core';

const groups = ref(new Map<string, number>());
export const useMostEcoFriendly = (amount: MaybeRef<number>, group: MaybeRef<string>): ComputedRef<boolean> => {
  const max = groups.value.get(get(group)) ?? 0;

  if (get(amount) >= max) {
    groups.value.set(get(group), get(amount));
  }

  return computed(() => {
    const max = groups.value.get(get(group)) ?? 0;

    return get(amount) >= max;
  });
};
