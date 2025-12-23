import {computed, type ComputedRef, type Ref} from 'vue';
import {
  type MakeRequired,
  type SelectOption,
  type SelectOptionValue,
  type CarrierIdentifier,
} from '@myparcel-dev/do-shared';

type SelectOptionWithCarrier<T extends SelectOptionValue> = MakeRequired<SelectOption<T>, 'carrier'>;

export const useOptionsGroupedByCarrier = <T extends SelectOptionValue>(
  options: Ref<SelectOptionWithCarrier<T>[]>
): {
  grouped: ComputedRef<[CarrierIdentifier, SelectOptionWithCarrier<T>[]][]>;
} => {
  const grouped = computed(() => {
    const groupedOptions = options.value.reduce((acc, option) => {
      const group = option.carrier;

      if (!acc[group]) {
        acc[group] = [];
      }

      acc[group].push(option);
      return acc;
    }, {} as Record<CarrierIdentifier, SelectOptionWithCarrier<T>[]>);

    return Object.entries(groupedOptions) as [CarrierIdentifier, SelectOptionWithCarrier<T>[]][];
  });

  return {
    grouped,
  };
};
