import {type ConfigOption} from '../types';
import {OptionType} from '../constants';
import {defineOption} from './defineOption';

export const defineOptionWithPrice = <O extends ConfigOption>(option: O, priceKey: string): [O, ConfigOption] => {
  const resolvedOption = defineOption(option);

  return [
    resolvedOption,

    defineOption({
      ...option,
      key: priceKey,
      parents: [...(option.parents ?? []), resolvedOption.key],
      type: OptionType.Currency,
    }),
  ];
};
