import {type ConfigEnv, type UserConfigFn} from 'vitest/config';
import {type UserConfig, type Alias} from 'vite';
import {type PromiseOr, type RecursivePartial} from '@myparcel-dev/ts-utils';

declare function createViteConfig<>(
  config?: RecursivePartial<UserConfig> | ((env: ConfigEnv) => PromiseOr<RecursivePartial<UserConfig>>),
): UserConfigFn;

declare const resolveAlias: Alias[];
