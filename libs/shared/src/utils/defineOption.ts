import {validateIsBoolean, validateIsNumeric, validateIsString, validateIsTime} from '../validator';
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
      resolvedOption.validators.push(validateIsNumeric());
      break;

    case OptionType.String:
      resolvedOption.validators.push(validateIsString());
      break;

    case OptionType.Boolean:
      resolvedOption.validators.push(validateIsBoolean());
      break;

    case OptionType.Time:
      resolvedOption.validators.push(validateIsTime());
      break;
  }

  return resolvedOption;
};
