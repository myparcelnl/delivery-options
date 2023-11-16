import {type CustomValidator} from '../types/validator.types';

export const stringValidator = (): CustomValidator<string> => {
  return {
    validate: (_, value) => typeof value === 'string',
    errorMessage: 'Value must be a string',
  };
};
