import {createValueMustHave} from './strings';
import {defineValidator} from './defineValidator';

export const validateHasMinKeys = defineValidator<Record<string, unknown>>((keys: number, message?: string) => {
  return {
    validate: (value): value is Record<string, unknown> => Object.keys(value).length >= keys,
    error: message ?? createValueMustHave(`at least ${keys} keys`),
  };
});
