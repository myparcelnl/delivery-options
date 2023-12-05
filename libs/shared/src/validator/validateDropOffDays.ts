import {isString} from 'radash';
import {type OneOrMore} from '@myparcel/ts-utils';
import {toArrayWithAnySeparator} from '../utils/toArrayWithAnySeparator';
import {validateIsInRange} from './validateIsInRange';
import {createValueMustBe} from './strings';
import {defineValidator} from './defineValidator';

const parseDropOffDays = (value: OneOrMore<string | number>): number[] => {
  let array: (string | number)[] = [];

  if (isString(value)) {
    array = toArrayWithAnySeparator(value);
  } else if (Array.isArray(value)) {
    array = value;
  }

  return array.map(Number);
};

export const validateDropOffDays = defineValidator<OneOrMore<string | number>>(() => {
  return {
    validate(value) {
      const array = parseDropOffDays(value);

      return array.length > 1 && array.every((item) => validateIsInRange(0, 6).validate(item));
    },
    parse: parseDropOffDays,
    error: createValueMustBe(`between 0 and 6`),
  };
});
