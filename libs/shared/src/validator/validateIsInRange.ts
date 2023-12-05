import {createValueMustBe} from './strings';
import {defineValidator} from './defineValidator';

export const validateIsInRange = defineValidator<number>((min: number, max: number) => {
  return {
    validate: (value) => value >= min && value <= max,
    error: createValueMustBe(`between ${min} and ${max}`),
  };
});
