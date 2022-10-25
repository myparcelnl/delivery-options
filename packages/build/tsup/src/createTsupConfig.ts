import {Options} from 'tsup';
import {commonTsupConfig} from './commonTsupConfig';
import {mergeConfig} from 'vite';

type CreateTsupConfig = (config?: Options) => Options;

export const createTsupConfig: CreateTsupConfig = (config) => {
  return mergeConfig(commonTsupConfig, config ?? {});
};
