import {createValueMustBeA, TYPE_STRING} from './strings';
import {defineValidator} from './defineValidator';

export const validateIsString = defineValidator<unknown, string>(() => {
  return {
    validate: (value): value is string => typeof value === TYPE_STRING,
    error: createValueMustBeA(TYPE_STRING),
  };
});
