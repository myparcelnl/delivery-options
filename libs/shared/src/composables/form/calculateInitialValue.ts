import {type WritableComputedRef} from 'vue';
import {get} from '@vueuse/core';
import {type ArrayItem, type SelectInputModelValue, type SelectOption} from '@myparcel-do/shared';
import {type OneOrMore, toArray} from '@myparcel/ts-utils';

export const calculateInitialValue = <T extends OneOrMore<SelectInputModelValue>>(
  model: WritableComputedRef<T>,
  options: SelectOption<ArrayItem<T>>[],
): T | null => {
  const value = get(model);

  const multiple = Array.isArray(value);
  const currentValues = toArray(value);
  const hasExistingValue = currentValues.length && options.some((option) => currentValues.includes(option.value));

  if (hasExistingValue || options.length === 0) {
    return null;
  }

  const selected = options.filter((option) => option.selected);
  const selectable = selected.length ? selected : options.slice(0, 1);

  if (!multiple) {
    return selectable[0].value as T;
  }

  return selectable.map((item) => item.value) as T;
};
