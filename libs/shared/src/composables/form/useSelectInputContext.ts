import {type SelectInputEmits, type SelectInputModelValue, type SelectInputProps, type WithElement} from '../../types';
import {type InputWithOptionsContext, useInputWithOptionsContext} from './useInputWithOptionsContext';

export const useSelectInputContext = <
  Type extends SelectInputModelValue,
  Props extends WithElement<SelectInputProps<Type>>,
>(
  props: Props,
  emit: SelectInputEmits<Type>,
): InputWithOptionsContext<Type> => {
  return useInputWithOptionsContext(props, emit);
};
