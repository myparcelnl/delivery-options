import {type ConfigEnv, type UserConfigFn} from 'vitest/config';
import {type UserConfig} from 'vite';
import {type PromiseOr, type RecursivePartial} from '@myparcel/ts-utils';

declare function createViteConfig<
  C extends RecursivePartial<UserConfig> | ((env: ConfigEnv) => PromiseOr<RecursivePartial<UserConfig>>),
>(
  config?: C,
): (
  env: ConfigEnv,
) => C extends UserConfigFn ? ReturnType<C> : C extends RecursivePartial<UserConfig> ? UserConfig : never;
