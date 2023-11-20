import {booleanValidator, type ConfigOption, numberValidator, OptionType, stringValidator} from '@myparcel-do/shared';

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
