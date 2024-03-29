import {isObject} from 'radash';
import {type ConfigKey, type ConfigOption, type ResolvedConfigOption} from '../types';

export const resolveConfigOption = <O extends ConfigKey | ConfigOption>(option: O): ResolvedConfigOption<O> => {
  return (isObject(option) ? option : {key: option}) as ResolvedConfigOption<O>;
};
