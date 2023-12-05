import {isNumber, isString} from 'radash';
import {createValueMustBeA} from './strings';
import {defineValidator} from './defineValidator';

export const validateIsNumeric = defineValidator(() => {
  return {
    validate: (value) => {
      return isNumber(value) || (isString(value) && value.length > 0 && !isNaN(Number(value)));
    },
    error: createValueMustBeA('numeric value'),
    parse: Number,
  };
});
