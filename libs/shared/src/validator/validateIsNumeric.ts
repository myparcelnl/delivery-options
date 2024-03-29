import {isNumber, isString} from 'radash';
import {createValueMustBeA} from './strings';
import {defineValidator} from './defineValidator';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateIsNumeric = defineValidator<any, number>(() => {
  return {
    validate: (value): value is number => {
      return isNumber(value) || (isString(value) && value.length > 0 && !isNaN(Number(value)));
    },
    error: createValueMustBeA('numeric value'),
    parse: Number,
  };
});
