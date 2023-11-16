import {type CustomValidator} from '../types/validator.types';

export const dateValidator = (): CustomValidator<Date> => {
  return {
    validate: (_, value) => value instanceof Date,
    errorMessage: 'Value must be a date',
  };
};
