import {isString} from 'radash';
import {createValueMustBe} from './strings';
import {defineValidator} from './defineValidator';

const COUNTRY_CODE_LENGTH = 2;

export const validateIsCountryCode = defineValidator<string, string>(() => ({
  validate: (value): value is string => isString(value) && value.length === COUNTRY_CODE_LENGTH,
  parse: (value) => value.toUpperCase(),
  error: createValueMustBe('a valid country code'),
}));
