import {normalizeDate} from '@vueuse/core';
import {createValueMustBeA} from './strings';
import {defineValidator} from './defineValidator';

export const validateIsDate = defineValidator(() => {
  return {
    validate: (value) => value instanceof Date,
    parse: normalizeDate,
    error: createValueMustBeA('Date'),
  };
});
