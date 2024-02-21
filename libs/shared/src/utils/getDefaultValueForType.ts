import {OptionType} from '../data';

export const getDefaultValueForType = (type?: OptionType): unknown => {
  switch (type) {
    case OptionType.Boolean:
      return false;

    case OptionType.Number:
    case OptionType.Currency:
      return 0;

    case OptionType.String:
      return '';

    default:
      return undefined;
  }
};
