import {type CustomValidator} from '../types';

export const rangeValidator = (min: number, max: number): CustomValidator<number> => {
  return {
    validate: (_, value) => value >= min && value <= max,
    errorMessage: `Value must be between ${min} and ${max}`,
  };
};
