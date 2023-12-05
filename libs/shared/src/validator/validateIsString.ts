import {createValueMustBeA, TYPE_STRING} from './strings';
import {defineValidator} from './defineValidator';

export const validateIsString = defineValidator(() => {
  return {
    validate: (value) => typeof value === TYPE_STRING,
    error: createValueMustBeA(TYPE_STRING),
  };
});
