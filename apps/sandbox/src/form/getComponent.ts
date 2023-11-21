import {type Component} from 'vue';
import FormToggleInput from '../components/form/FormToggleInput.vue';
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

    default:
      return FormToggleInput;
  }
};
