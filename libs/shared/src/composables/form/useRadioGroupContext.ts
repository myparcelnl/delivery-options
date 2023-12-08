import {type RadioGroupEmits, type RadioGroupModelValue, type RadioGroupProps, type WithElement} from '../../types';
import {type InputWithOptionsContext, useInputWithOptionsContext} from './useInputWithOptionsContext';

type RadioGroupContext<T extends RadioGroupModelValue> = InputWithOptionsContext<T>;

export const useRadioGroupContext = <
  T extends RadioGroupModelValue = RadioGroupModelValue,
  Props extends WithElement<RadioGroupProps<T>> = WithElement<RadioGroupProps<T>>,
>(
  props: Props,
  emit: RadioGroupEmits<T>,
): RadioGroupContext<T> => {
  // @ts-expect-error todo
  return useInputWithOptionsContext(props, emit);
};
