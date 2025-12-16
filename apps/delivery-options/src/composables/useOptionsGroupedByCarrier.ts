import {computed, type ComputedRef, type MaybeRef, toValue} from 'vue';
import {
  type ElementInstance,
  type MakeRequired,
  type SelectOption,
  type SelectOptionValue,
  type CarrierIdentifier,
} from '@myparcel-dev/do-shared';

type SelectOptionWithCarrier<T extends SelectOptionValue> = MakeRequired<SelectOption<T>, 'carrier'>;

type OptionsProps<T extends SelectOptionValue> = {
  options: SelectOptionWithCarrier<T>[];
};

export const useOptionsGroupedByCarrier = <T extends SelectOptionValue>(
  element: MaybeRef<ElementInstance<OptionsProps<T>>>,
): {
  options: ComputedRef<SelectOptionWithCarrier<T>[]>;
  grouped: ComputedRef<[CarrierIdentifier, SelectOptionWithCarrier<T>[]][]>;
} => {
  const options = computed(() => toValue(element).props.options as SelectOptionWithCarrier<T>[]);

  const grouped = computed(() => {
    const groupedOptions = options.value.reduce((acc, option: SelectOptionWithCarrier<T>) => {
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
    options,
    grouped,
  };
};
