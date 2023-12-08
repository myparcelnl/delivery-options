import {isString} from 'radash';
import {createValueMustBe} from './strings';
import {defineValidator} from './defineValidator';

export const validateIsCountryCode = defineValidator<string, string>(() => ({
  validate: (value): value is string => isString(value) && value.length === 2,
  parse: (value) => value.toUpperCase(),
  error: createValueMustBe('a valid country code'),
}));
