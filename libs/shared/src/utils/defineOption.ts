import {booleanValidator, numberValidator, stringValidator} from '../validator';
import {type ConfigOption} from '../types';
import {OptionType} from '../constants';

export const defineOption = <O extends ConfigOption>(option: O): O => {
  const resolvedOption = {
    validators: [],
    type: OptionType.Boolean,
    ...option,
  };

  switch (option.type) {
    case OptionType.Number:
      resolvedOption.validators.push(numberValidator());
      break;

    case OptionType.String:
      resolvedOption.validators.push(stringValidator());
      break;

    case OptionType.Boolean:
      resolvedOption.validators.push(booleanValidator());
      break;
  }

  return resolvedOption;
};
