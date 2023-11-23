import {
  type CheckboxGroupEmits,
  type CheckboxGroupModelValue,
  type CheckboxGroupProps,
  type WithElement,
} from '../../types';
import {type InputWithOptionsContext, useInputWithOptionsContext} from './useInputWithOptionsContext';

export const useCheckboxGroupContext = <
  T extends CheckboxGroupModelValue = CheckboxGroupModelValue,
  P extends WithElement<CheckboxGroupProps<T>> = WithElement<CheckboxGroupProps<T>>,
>(
  props: P,
  emit: CheckboxGroupEmits<T>,
): InputWithOptionsContext<T> => useInputWithOptionsContext(props, emit);
