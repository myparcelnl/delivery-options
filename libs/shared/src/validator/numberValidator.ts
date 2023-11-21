import {type CustomValidator} from '../types';

export const numberValidator = (): CustomValidator<number> => {
  return {
    validate: (_, value) => typeof value === 'number',
    errorMessage: 'Value must be a number',
  };
};
