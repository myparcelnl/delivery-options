import {computed, type MaybeRef, ref, type ComputedRef, toValue} from 'vue';

const groups = ref(new Map<string, number>());

export const useMostEcoFriendly = (amount: MaybeRef<number>, group: MaybeRef<string>): ComputedRef<boolean> => {
  const max = groups.value.get(toValue(group)) ?? 0;

  if (toValue(amount) >= max) {
    groups.value.set(toValue(group), toValue(amount));
  }

  return computed(() => {
    const max = groups.value.get(toValue(group)) ?? 0;

    return toValue(amount) >= max;
  });
};
