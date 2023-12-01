import {get} from '@vueuse/core';
import {
  type CheckboxGroupEmits,
  type CheckboxGroupModelValue,
  type CheckboxGroupProps,
  type SelectOption,
  type WithElement,
} from '../../types';
import {type InputWithOptionsContext, useInputWithOptionsContext} from './useInputWithOptionsContext';

export type CheckboxGroupContext<T extends CheckboxGroupModelValue = CheckboxGroupModelValue> =
  InputWithOptionsContext<T> & {
    createUpdateHandler(option: SelectOption<T>): (toggle: boolean) => void;
  };

export const useCheckboxGroupContext = <T extends CheckboxGroupModelValue = CheckboxGroupModelValue>(
  props: WithElement<CheckboxGroupProps<T>>,
  emit: CheckboxGroupEmits<T>,
): CheckboxGroupContext<T> => {
  const context = useInputWithOptionsContext(props, emit);

  const createUpdateHandler = (option: SelectOption<T>) => {
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
