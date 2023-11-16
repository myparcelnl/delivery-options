import {type CustomValidator} from '../types/validator.types';

export const booleanValidator = (): CustomValidator<boolean> => {
  return {
    validate: (_, value) => typeof value === 'boolean',
    errorMessage: 'Value must be a boolean',
  };
};
