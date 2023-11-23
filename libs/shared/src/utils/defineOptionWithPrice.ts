import {type ConfigOption, RelatedConfigOptionType} from '../types';
import {OptionType} from '../enums';
import {defineOption} from './defineOption';

export const defineOptionWithPrice = <O extends ConfigOption>(option: O, priceKey: string): [O, ConfigOption] => {
  const resolvedOption = defineOption({
    ...option,
    related: [
      {
        type: RelatedConfigOptionType.Price,
        key: priceKey,
      },
    ],
  });

  return [
    resolvedOption,

    defineOption({
      ...option,
      key: priceKey,
      parents: [...(option.parents ?? []), resolvedOption.key],
      type: OptionType.Currency,
      related: [
        {
          type: RelatedConfigOptionType.Allow,
          key: option.key,
        },
      ],
    }),
  ];
};
