import {OptionType} from '@myparcel-do/shared';

export const getDefaultValueForType = (type?: OptionType) => {
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
