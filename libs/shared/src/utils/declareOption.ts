import {validateIsBoolean, validateIsNumeric, validateIsString, validateIsTime} from '../validator';
import {type ConfigKey, type ConfigOption, type ResolvedConfigOption} from '../types';
import {OptionType} from '../data';
import {resolveConfigOption} from './resolveConfigOption';

export const declareOption = <O extends ConfigKey | ConfigOption>(option: O): ResolvedConfigOption<O> => {
  const configOption = resolveConfigOption(option);

  const resolvedOption = {
    validators: [],
    type: OptionType.Boolean,
    ...configOption,
  };

  switch (configOption.type) {
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
