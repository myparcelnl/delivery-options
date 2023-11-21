import {type SelectInputEmits, type SelectInputModelValue, type SelectInputProps, type WithElement} from '../../types';
import {type InputWithOptionsContext, useInputWithOptionsContext} from './useInputWithOptionsContext';

export const useSelectInputContext = <
  T extends SelectInputModelValue = SelectInputModelValue,
  P extends WithElement<SelectInputProps<T>> = WithElement<SelectInputProps<T>>,
>(
  props: P,
  emit: SelectInputEmits<T>,
): InputWithOptionsContext<T> => useInputWithOptionsContext(props, emit);
