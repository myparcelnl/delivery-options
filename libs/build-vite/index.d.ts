import {PromiseOr, RecursivePartial} from '@myparcel/ts-utils';
import {UserConfigExport} from 'vitest/dist/config';
import {UserConfigFn} from 'vitest/config';

declare function createViteConfig(config?: PromiseOr<RecursivePartial<UserConfigExport>>): UserConfigFn;
