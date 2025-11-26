import {type Component} from 'vue';
import {type ConfigOption, OptionType} from '@myparcel-dev/shared';
import {
  FormCheckboxGroupInput,
  FormCurrencyInput,
  FormNumberInput,
  FormSelectInput,
  FormTextInput,
  FormTimeInput,
  FormToggleInput,
} from '../components';

export const getComponent = (option: ConfigOption): Component => {
  switch (option.type) {
    case OptionType.String:
      return FormTextInput;

    case OptionType.Number:
      return FormNumberInput;

    case OptionType.Currency:
      return FormCurrencyInput;

    case OptionType.Time:
      return FormTimeInput;

    case OptionType.Select:
      return FormSelectInput;

    case OptionType.MultiSelect:
      return FormCheckboxGroupInput;

    default:
      return FormToggleInput;
  }
};
