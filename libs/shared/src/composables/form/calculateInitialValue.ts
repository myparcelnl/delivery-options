import {type WritableComputedRef, toValue} from 'vue';
import {type OneOrMore, toArray} from '@myparcel/ts-utils';
import {type SelectInputModelValue, type SelectOption} from '../../types';

export const calculateInitialValue = <T extends OneOrMore<SelectInputModelValue>>(
  model: WritableComputedRef<T>,
  options: SelectOption<T>[],
): T | null => {
  const allowedValues = options.map((option) => option.value);
  const currentValue = toValue(model);

  const disabled = options.filter((option) => option.disabled);

  if (!disabled.length && (options.length === 0 || options.some((option) => option.value === currentValue))) {
    return null;
  }

  if (!Array.isArray(currentValue)) {
    const selected = options.filter((option) => option.selected);
    const selectable = selected.length ? selected : options.slice(0, 1);

    return selectable[0].value;
  }

  const existingValues = toArray(currentValue).filter((value) => allowedValues.includes(value));
  const newOptions = new Set(existingValues);

  options.forEach((option) => {
    if (option.selected && (option.disabled || !existingValues.length)) {
      newOptions.add(option.value);
    }

    if (!option.selected && option.disabled) {
      newOptions.delete(option.value);
    }
  });

  return Array.from(newOptions) as T;
};
