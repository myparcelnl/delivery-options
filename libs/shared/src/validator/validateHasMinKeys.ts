import {createValueMustHave} from './strings';
import {defineValidator} from './defineValidator';

export const validateHasMinKeys = defineValidator((keys: number, message?: string) => {
  return {
    validate: (value) => Object.keys(value).length >= keys,
    error: message ?? createValueMustHave(`at least ${keys} keys`),
  };
});
