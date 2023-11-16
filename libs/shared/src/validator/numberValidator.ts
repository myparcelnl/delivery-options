import {type CustomValidator} from '../types/validator.types';

export const numberValidator = (): CustomValidator<number> => {
  return {
    validate: (_, value) => typeof value === 'number',
    errorMessage: 'Value must be a number',
  };
};
