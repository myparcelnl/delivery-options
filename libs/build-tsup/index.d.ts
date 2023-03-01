import {Options} from 'tsup';
import {RecursivePartial} from '@myparcel/ts-utils';

type CreateCommonTsupConfig = (config?: RecursivePartial<Options>) => Options;

declare function createTsupConfig(config?: RecursivePartial<Options>): Options;
