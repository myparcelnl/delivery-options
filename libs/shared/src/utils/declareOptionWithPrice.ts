import {
  type AnyConfigKey,
  type ConfigOption,
  type ConfigPriceKey,
  RelatedConfigOptionType,
  type ResolvedConfigOption,
} from '../types';
import {OptionType} from '../enums';
import {resolveConfigOption} from './resolveConfigOption';
import {declareOption} from './declareOption';

export const declareOptionWithPrice = <O extends AnyConfigKey | ConfigOption>(
  option: O,
  priceKey: ConfigPriceKey,
): [ResolvedConfigOption<O>, ConfigOption] => {
  const configOption = resolveConfigOption(option);

  const resolvedOption = declareOption({
    ...configOption,
    related: [
      {
        type: RelatedConfigOptionType.Price,
        key: priceKey,
      },
    ],
  } as O);

  return [
    resolvedOption,

    declareOption({
      ...configOption,
      key: priceKey,
      parents: [...(resolvedOption.parents ?? []), resolvedOption.key],
      type: OptionType.Currency,
      // related: [
      //   {
      //     type: RelatedConfigOptionType.Allow,
      //     key: option.key,
      //   },
      // ],
    }),
  ];
};
