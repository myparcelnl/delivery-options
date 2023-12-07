import {type AnyConfigKey, type ConfigOption, type ConfigPriceKey, type ResolvedConfigOption} from '../types';
import {OptionType} from '../enums';
import {resolveConfigOption} from './resolveConfigOption';
import {declareOptionWithPrice} from './declareOptionWithPrice';
import {declareOption} from './declareOption';

type ConfigOptionsTuple<C extends undefined | string, O extends AnyConfigKey | ConfigOption> = C extends string
  ? [ResolvedConfigOption<O>, ConfigOption, ConfigOption]
  : [ResolvedConfigOption<O>, ConfigOption];

export const declareDeliveryOption = <O extends AnyConfigKey | ConfigOption, C extends undefined | string>(
  option: O,
  priceKey: ConfigPriceKey,
  cutOffTimeKey?: C,
): ConfigOptionsTuple<C, O> => {
  const configOption = resolveConfigOption(option);

  return [
    ...declareOptionWithPrice(option, priceKey),

    ...(cutOffTimeKey
      ? [
          declareOption({
            ...configOption,
            key: cutOffTimeKey,
            parents: [...(configOption.parents ?? []), configOption.key],
            type: OptionType.Time,
          } as ConfigOption),
        ]
      : []),
  ] as ConfigOptionsTuple<C, O>;
};
