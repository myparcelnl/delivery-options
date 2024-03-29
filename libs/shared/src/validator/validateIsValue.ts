import {type ReadonlyOr} from '@myparcel/ts-utils';
import {createValueMustBe} from './strings';
import {defineValidator} from './defineValidator';

export const validateIsValue = defineValidator(<T>(values: ReadonlyOr<T[]>) => ({
  validate: (value): value is (keyof T)[] => values.includes(value as T),
  error: createValueMustBe(`one of ${values.join(', ')}`),
}));
