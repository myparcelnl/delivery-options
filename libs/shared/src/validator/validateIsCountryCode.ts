import {createValueMustBe} from './strings';
import {defineValidator} from './defineValidator';

export const validateIsCountryCode = defineValidator<string, string>(() => ({
  validate: (value) => /^[A-Z]{2}$/i.exec(String(value)) !== null,
  error: createValueMustBe('a valid country code'),
  parse: (value) => value.toUpperCase(),
}));
