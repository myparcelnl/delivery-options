import {booleanValidator, numberValidator, stringValidator, timeValidator} from '../validator';
import {type ConfigOption} from '../types';
import {OptionType} from '../enums';

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

    case OptionType.Time:
      resolvedOption.validators.push(timeValidator());
      break;
  }

  return resolvedOption;
};
