import {get} from '@vueuse/core';
import {
  type ArrayItem,
  type CheckboxGroupEmits,
  type CheckboxGroupModelValue,
  type CheckboxGroupProps,
  type SelectOption,
  type WithElement,
} from '../../types';
import {type InputWithOptionsContext, useInputWithOptionsContext} from './useInputWithOptionsContext';

export type CheckboxGroupContext<T extends CheckboxGroupModelValue = CheckboxGroupModelValue> =
  InputWithOptionsContext<T> & {
    createUpdateHandler(option: SelectOption<ArrayItem<T>>): (toggle: boolean) => void;
  };

export const useCheckboxGroupContext = <
  T extends CheckboxGroupModelValue = CheckboxGroupModelValue,
  P extends WithElement<CheckboxGroupProps<T>> = WithElement<CheckboxGroupProps<T>>,
>(
  props: P,
  emit: CheckboxGroupEmits<T>,
): CheckboxGroupContext<T> => {
  const context = useInputWithOptionsContext<T>(props, emit);

  const createUpdateHandler = (option: SelectOption<ArrayItem<T>>) => {
    return (toggle: boolean) => {
      const newModel = [...get(context.model)];

      if (toggle) {
        newModel.push(option.value);
      } else {
        newModel.splice(newModel.indexOf(option.value), 1);
      }

      emit('update:modelValue', newModel);
    };
  };

  return {
    ...context,
    createUpdateHandler,
  };
};
