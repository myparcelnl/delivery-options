import {createValueMustBeA, TYPE_BOOLEAN} from './strings';
import {defineValidator} from './defineValidator';

export const validateIsBoolean = defineValidator<unknown, boolean>(() => {
  return {
    validate: (value): value is boolean => typeof value === TYPE_BOOLEAN,
    error: createValueMustBeA(TYPE_BOOLEAN),
  };
});
