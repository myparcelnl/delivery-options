import {isString} from 'radash';
import {createValueMustBe} from './strings';
import {defineValidator} from './defineValidator';

export const validateMatch = defineValidator((regex: RegExp) => ({
  validate: (value) => isString(value) && regex.test(value),
  error: createValueMustBe(`in the format ${regex}`),
}));
