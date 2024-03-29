import {validateIsNumeric} from './validateIsNumeric';
import {createValueMustBe} from './strings';
import {defineValidator} from './defineValidator';

export const validateIsInRange = defineValidator((min: number, max: number) => {
  return {
    validate(value): value is number {
      const numericValidator = validateIsNumeric();

      if (!numericValidator.validate(value)) {
        return false;
      }

      return value >= min && value <= max;
    },
    error: createValueMustBe(`between ${min} and ${max}`),
  };
});
