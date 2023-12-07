import {isObject} from 'radash';
import {type AnyConfigKey, type ConfigOption, type ResolvedConfigOption} from '../types';

export const resolveConfigOption = <O extends AnyConfigKey | ConfigOption>(option: O): ResolvedConfigOption<O> => {
  return (isObject(option) ? option : {key: option}) as ResolvedConfigOption<O>;
};
