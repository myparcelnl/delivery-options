import {validateIsString} from './validateIsString';
import {createValueMustBeA} from './strings';
import {defineValidator} from './defineValidator';

export const validateIsTime = defineValidator(() => {
  return {
    validate: (value) => {
      const isString = validateIsString().validate(value);

      return isString && /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.exec(value) !== null;
    },
    error: createValueMustBeA('time in the format HH:mm'),
  };
});
