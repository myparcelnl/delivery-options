import {type ConfigEnv, type UserConfigFn} from 'vitest/config';
import {type UserConfig} from 'vite';
import {type PromiseOr, type RecursivePartial} from '@myparcel/ts-utils';

declare function createViteConfig<>(
  config?: RecursivePartial<UserConfig> | ((env: ConfigEnv) => PromiseOr<RecursivePartial<UserConfig>>),
): UserConfigFn;
