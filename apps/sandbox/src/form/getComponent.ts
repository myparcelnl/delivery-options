import {type Component} from 'vue';
import {type ConfigOption, OptionType} from '@myparcel-do/shared';
import FormToggleInput from '../components/form/FormToggleInput.vue';
import FormTimeInput from '../components/form/FormTimeInput.vue';
import FormTextInput from '../components/form/FormTextInput.vue';
import FormNumberInput from '../components/form/FormNumberInput.vue';
import FormCurrencyInput from '../components/form/FormCurrencyInput.vue';

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

    default:
      return FormToggleInput;
  }
};
