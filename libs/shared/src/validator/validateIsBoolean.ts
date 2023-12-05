import {createValueMustBeA, TYPE_BOOLEAN} from './strings';
import {defineValidator} from './defineValidator';

export const validateIsBoolean = defineValidator(() => {
  return {
    validate: (value) => typeof value === TYPE_BOOLEAN,
    error: createValueMustBeA(TYPE_BOOLEAN),
  };
});
