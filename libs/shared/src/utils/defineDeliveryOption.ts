import {type ConfigOption} from '../types';
import {OptionType} from '../constants';
import {defineOptionWithPrice} from './defineOptionWithPrice';
import {defineOption} from './defineOption';

export const defineDeliveryOption = <O extends ConfigOption, C extends undefined | string>(
  option: O,
  priceKey: string,
  cutOffTimeKey?: C,
): C extends string ? [O, ConfigOption, ConfigOption] : [O, ConfigOption] => {
  return [
    ...defineOptionWithPrice(option, priceKey),

    ...(cutOffTimeKey
      ? [
          defineOption({
            ...option,
            key: cutOffTimeKey,
            parents: [...(option.parents ?? []), option.key],
            type: OptionType.Time,
          }),
        ]
      : []),
  ];
};
