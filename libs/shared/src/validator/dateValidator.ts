import {type CustomValidator} from '../types';

export const dateValidator = (): CustomValidator<Date> => {
  return {
    validate: (_, value) => value instanceof Date,
    errorMessage: 'Value must be a date',
  };
};
